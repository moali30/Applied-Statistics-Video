"""Clean the recorded clips and apply the timing edits the video needs.

Usage: python3 tools/build_audio.py [clip numbers...]

For every clip in audio/raw/NN.m4a:
  1. high-pass at 70 Hz and gentle compression (ffmpeg),
  2. loudness normalization to -16 LUFS with a -1.5 dB peak limiter,
  3. the edits from video/edits.json: trim the start/end, and stretch or
     shorten pauses so the on-screen countdown has the length it needs,
  4. short fades at every cut so there are no clicks.

Writes video/build/audio/NN.wav (used by the renderer), audio/clean/NN.m4a
(to listen to), and video/build/audio/manifest.json with each clip's
duration and the raw-time -> final-time map.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "audio" / "raw"
CLEAN = ROOT / "audio" / "clean"
BUILD = ROOT / "video" / "build" / "audio"
EDITS = ROOT / "video" / "edits.json"

RATE = 48000
TARGET_LUFS = -16.0
PREFILTER = "highpass=f=70,afftdn=nr=10:nf=-60:tn=1,acompressor=threshold=0.063:ratio=2.5:attack=8:release=120"
LIMITER = "alimiter=limit=0.84:attack=3:release=60:level=false"
FADE = 0.012


def ffmpeg_decode(path, af):
    raw = subprocess.check_output(
        ["ffmpeg", "-v", "error", "-i", str(path), "-af", af,
         "-f", "f32le", "-ac", "1", "-ar", str(RATE), "-"])
    return np.frombuffer(raw, dtype=np.float32).copy()


def integrated_loudness(path, af):
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
         "-af", af + ",ebur128", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    summary = out[out.rfind("Summary:"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", summary).group(1))


def fade(x, n_in, n_out):
    if n_in:
        x[:n_in] *= np.linspace(0, 1, n_in, dtype=np.float32)
    if n_out:
        x[-n_out:] *= np.linspace(1, 0, n_out, dtype=np.float32)
    return x


def apply_edits(x, edit):
    """Return the edited signal and the list of (raw_time, delta) shifts."""
    start, end = edit.get("trim", [0, None])
    end = len(x) / RATE if end is None else end
    cuts = []  # (raw_time, delta_seconds)
    for p in edit.get("pauses", []):
        have = p["end"] - p["start"]
        cuts.append(((p["start"] + p["end"]) / 2, p["len"] - have))
    cuts.sort()

    pieces, pos = [], start
    nf = int(FADE * RATE)
    for at, delta in cuts:
        if delta >= 0:
            pieces.append(x[int(pos * RATE):int(at * RATE)].copy())
            pieces.append(np.zeros(int(delta * RATE), dtype=np.float32))
            pos = at
        else:
            pieces.append(x[int(pos * RATE):int((at + delta / 2) * RATE)].copy())
            pos = at - delta / 2
    pieces.append(x[int(pos * RATE):int(end * RATE)].copy())
    for i, piece in enumerate(pieces):
        if len(piece) > 2 * nf and piece.any():
            fade(piece, nf, nf)
    tail = np.zeros(int(edit.get("tail", 0) * RATE), dtype=np.float32)
    return np.concatenate(pieces + [tail]), start, cuts


def write_wav(path, x):
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "1", "-ar", str(RATE),
         "-i", "-", "-c:a", "pcm_s16le", str(path)],
        input=x.astype(np.float32).tobytes(), check=True)


def write_m4a(src, dst):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src),
                    "-c:a", "aac", "-b:a", "128k", str(dst)], check=True)


def main(nums):
    edits = json.loads(EDITS.read_text(encoding="utf-8"))
    BUILD.mkdir(parents=True, exist_ok=True)
    CLEAN.mkdir(parents=True, exist_ok=True)
    manifest_path = BUILD / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    clips = sorted(p.stem for p in RAW.glob("*.m4a"))
    for name in clips:
        if nums and int(name) not in nums:
            continue
        src = RAW / f"{name}.m4a"
        lufs = integrated_loudness(src, PREFILTER)
        gain = TARGET_LUFS - lufs
        x = ffmpeg_decode(src, f"{PREFILTER},volume={gain:.2f}dB,{LIMITER}")
        edit = edits.get(name, {})
        y, start, cuts = apply_edits(x, edit)
        wav = BUILD / f"{name}.wav"
        write_wav(wav, y)
        write_m4a(wav, CLEAN / f"{name}.m4a")
        manifest[name] = {
            "duration": round(len(y) / RATE, 3),
            "trim_start": start,
            "shifts": [[round(a, 3), round(d, 3)] for a, d in cuts],
            "gain_db": round(gain, 2),
        }
        print(f"{name}: {lufs:.1f} LUFS, gain {gain:+.1f} dB, {len(y) / RATE:.1f}s")
    manifest_path.write_text(json.dumps(dict(sorted(manifest.items())), indent=1))


if __name__ == "__main__":
    main({int(a) for a in sys.argv[1:]})
