"""Render a recording script (Markdown subset) as a readable RTL HTML page.

Usage: python3 tools/script_to_html.py script/section-01-script.md script/section-01-script.html

Supported syntax:
  #  title            ## part            ### 🎙️ NN — clip title
  > on-screen cue      - bullet          ⏸️ pause marker
  **bold**, `code`, any other line is spoken text.
"""

import html
import re
import sys

WORDS_PER_MINUTE = 140
PAUSE_SECONDS = 3


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    return text


def spoken_seconds(lines, pauses):
    words = sum(len(line.split()) for line in lines)
    return words / WORDS_PER_MINUTE * 60 + pauses * PAUSE_SECONDS


def fmt_duration(seconds):
    seconds = round(seconds)
    return f"{seconds // 60}:{seconds % 60:02d}"


def parse(md):
    doc = {"title": "", "subtitle": "", "blocks": []}
    clip = None
    for raw in md.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("### "):
            m = re.match(r"###\s*🎙️\s*(\d+)\s*—\s*(.+)", line)
            clip = {"type": "clip", "num": m.group(1), "title": m.group(2),
                    "cue": None, "items": [], "spoken": [], "pauses": 0}
            doc["blocks"].append(clip)
        elif line.startswith("## "):
            clip = None
            doc["blocks"].append({"type": "part", "title": line[3:]})
        elif line.startswith("# "):
            doc["title"] = line[2:]
        elif clip is None:
            if line.startswith("> "):
                doc["blocks"].append({"type": "note", "text": line[2:]})
            elif line.startswith("- "):
                doc["blocks"].append({"type": "bullet", "text": line[2:]})
            elif not doc["blocks"]:
                doc["subtitle"] = line
            else:
                doc["blocks"].append({"type": "para", "text": line})
        elif line.startswith("> "):
            clip["cue"] = line[2:]
        elif line.startswith("⏸️"):
            clip["pauses"] += 1
            clip["items"].append(("pause", line.replace("⏸️", "").strip()))
        else:
            clip["spoken"].append(re.sub(r"[*`]", "", line))
            clip["items"].append(("say", line))
    return doc


CSS = """
:root {
  --bg: #f7f5f0; --card: #ffffff; --ink: #14213d; --muted: #5b6475;
  --navy: #0f2a4f; --gold: #e0a51b; --gold-soft: #fbf1d6; --blue-soft: #e7eef8;
  --line: #e4e0d6;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1626; --card: #14213a; --ink: #eef1f7; --muted: #a3adbf;
    --navy: #8fb4ec; --gold: #f2bd43; --gold-soft: #3a2f12; --blue-soft: #1c2d4b;
    --line: #26375a;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: "Noto Sans Arabic", "Cairo", "Segoe UI", Tahoma, sans-serif;
  line-height: 1.9;
}
main { max-width: 860px; margin: 0 auto; padding: 32px 16px 80px; }
header { border-bottom: 3px solid var(--gold); padding-bottom: 16px; margin-bottom: 24px; }
h1 { font-size: 2rem; margin: 0; color: var(--navy); line-height: 1.4; }
.subtitle { color: var(--muted); margin: 4px 0 0; }
.stats { margin-top: 10px; color: var(--muted); font-size: .95rem; }
.stats b { color: var(--ink); }
h2 { color: var(--navy); font-size: 1.4rem; margin: 40px 0 12px; }
ul { padding-inline-start: 22px; margin: 0; }
li { margin: 4px 0; }
.note { background: var(--blue-soft); border-radius: 10px; padding: 10px 14px; color: var(--muted); }
.clip {
  background: var(--card); border: 1px solid var(--line); border-radius: 14px;
  padding: 18px 20px; margin: 16px 0; break-inside: avoid;
}
.clip-head { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.num {
  flex: none; background: var(--navy); color: var(--bg); font-weight: 700;
  border-radius: 10px; padding: 2px 12px; font-size: 1.15rem; direction: ltr;
}
.clip-title { font-weight: 700; font-size: 1.15rem; flex: 1; }
.dur { color: var(--muted); font-size: .85rem; direction: ltr; }
.cue {
  color: var(--muted); font-size: .9rem; border-inline-start: 3px solid var(--line);
  padding-inline-start: 10px; margin: 0 0 12px;
}
.cue::before { content: "على الشاشة · "; font-weight: 700; }
.say { font-size: 1.3rem; margin: 6px 0; }
.say strong { color: var(--navy); }
.pause {
  display: inline-block; background: var(--gold-soft); color: var(--ink);
  border: 1px dashed var(--gold); border-radius: 999px; padding: 2px 14px;
  margin: 8px 0; font-weight: 700;
}
code { background: var(--blue-soft); border-radius: 4px; padding: 0 6px; direction: ltr; display: inline-block; }
@media print { .clip { border-color: #ccc; } body { background: #fff; } }
"""


def render(doc):
    clips = [b for b in doc["blocks"] if b["type"] == "clip"]
    total = sum(spoken_seconds(c["spoken"], c["pauses"]) for c in clips)
    out = [
        "<!doctype html>",
        '<html lang="ar" dir="rtl"><head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f"<title>{html.escape(doc['title'])}</title>",
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">',
        f"<style>{CSS}</style></head><body><main>",
        "<header>",
        f"<h1>{inline(doc['title'])}</h1>",
        f'<p class="subtitle">{inline(doc["subtitle"])}</p>',
        f'<div class="stats"><b>{len(clips)}</b> مقطع · المدة التقريبية للكلام <b dir="ltr">{fmt_duration(total)}</b> دقيقة</div>',
        "</header>",
    ]
    in_list = False
    for b in doc["blocks"]:
        if b["type"] != "bullet" and in_list:
            out.append("</ul>")
            in_list = False
        if b["type"] == "part":
            out.append(f"<h2>{inline(b['title'])}</h2>")
        elif b["type"] == "note":
            out.append(f'<p class="note">{inline(b["text"])}</p>')
        elif b["type"] == "para":
            out.append(f"<p>{inline(b['text'])}</p>")
        elif b["type"] == "bullet":
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{inline(b['text'])}</li>")
        elif b["type"] == "clip":
            dur = fmt_duration(spoken_seconds(b["spoken"], b["pauses"]))
            out.append(f'<section class="clip" id="clip-{b["num"]}">')
            out.append(
                f'<div class="clip-head"><span class="num">🎙️ {b["num"]}</span>'
                f'<span class="clip-title">{inline(b["title"])}</span>'
                f'<span class="dur">~{dur}</span></div>'
            )
            if b["cue"]:
                out.append(f'<p class="cue">{inline(b["cue"])}</p>')
            for kind, text in b["items"]:
                if kind == "pause":
                    out.append(f'<div class="pause">⏸️ {inline(text or "اسكت 3 ثواني")}</div>')
                else:
                    out.append(f'<p class="say">{inline(text)}</p>')
            out.append("</section>")
    if in_list:
        out.append("</ul>")
    out.append("</main></body></html>")
    return "\n".join(out) + "\n"


def main():
    src, dst = sys.argv[1], sys.argv[2]
    with open(src, encoding="utf-8") as f:
        doc = parse(f.read())
    with open(dst, "w", encoding="utf-8") as f:
        f.write(render(doc))
    clips = [b for b in doc["blocks"] if b["type"] == "clip"]
    total = sum(spoken_seconds(c["spoken"], c["pauses"]) for c in clips)
    print(f"{len(clips)} clips, ~{fmt_duration(total)} min of speech -> {dst}")


if __name__ == "__main__":
    main()
