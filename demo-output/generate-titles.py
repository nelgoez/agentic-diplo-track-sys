#!/usr/bin/env python3
"""Generate title-card images using Pillow.

Usage:
  py demo-output/generate-titles.py --title "My Chapter" --subtitle "What happens" --output title-01.png
  py demo-output/generate-titles.py --batch     # generate all titles for the demo sequence

For batch mode, reads title definitions from DEMO-TITLES.json.
"""

import argparse
import json
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)


WIDTH = 1920
HEIGHT = 1080
BG_COLOR = (13, 17, 23)  # GitHub dark
ACCENT_COLOR = (88, 166, 255)  # Blue accent
TEXT_COLOR = (255, 255, 255)
SUB_COLOR = (139, 148, 158)  # Muted gray


def _find_font(
    size: int, bold: bool = False
) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_paths = [
        "C:/Windows/Fonts/consola.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/System/Library/Fonts/Menlo.ttc",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    return ImageFont.load_default()


def generate_title(
    output_path: str,
    title: str,
    subtitle: str = "",
    chapter: str = "",
    duration_sec: int = 0,
):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Accent bar at top
    draw.rectangle([(0, 0), (WIDTH, 6)], fill=ACCENT_COLOR)

    # Chapter label
    if chapter:
        font_sm = _find_font(28)
        draw.text((80, 60), chapter.upper(), fill=ACCENT_COLOR, font=font_sm)

    # Main title
    font_title = _find_font(64, bold=True)
    lines = _wrap_text(title, font_title, WIDTH - 160)
    y = 320
    for line in lines:
        draw.text((80, y), line, fill=TEXT_COLOR, font=font_title)
        y += 80

    # Subtitle
    if subtitle:
        font_sub = _find_font(32)
        draw.text((80, y + 40), subtitle, fill=SUB_COLOR, font=font_sub)

    # Duration hint
    if duration_sec > 0:
        font_dur = _find_font(24)
        dur_text = f"({duration_sec}s)"
        tw = draw.textlength(dur_text, font=font_dur)
        draw.text(
            (WIDTH - tw - 80, HEIGHT - 60), dur_text, fill=SUB_COLOR, font=font_dur
        )

    # Bottom bar
    draw.rectangle([(0, HEIGHT - 6), (WIDTH, HEIGHT)], fill=ACCENT_COLOR)

    img.save(output_path, "PNG")
    print(f"[generate-titles] Saved: {output_path}")


def _wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        if font.getlength(test) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def batch_generate(titles_file: str = "demo-output/DEMO-TITLES.json"):
    if not os.path.exists(titles_file):
        print(f"ERROR: {titles_file} not found. Run with --title/--subtitle first.")
        sys.exit(1)

    with open(titles_file) as f:
        titles = json.load(f)

    for i, t in enumerate(titles):
        output_path = t.get("output", f"demo-output/title-{i + 1:02d}.png")
        generate_title(
            output_path=output_path,
            title=t.get("title", "Untitled"),
            subtitle=t.get("subtitle", ""),
            chapter=t.get("chapter", ""),
            duration_sec=t.get("duration_sec", 0),
        )


def main():
    parser = argparse.ArgumentParser(description="Generate title card images")
    parser.add_argument("--title", type=str, help="Main title text")
    parser.add_argument("--subtitle", type=str, default="", help="Subtitle text")
    parser.add_argument(
        "--chapter", type=str, default="", help="Chapter label (small, top-left)"
    )
    parser.add_argument(
        "--duration", type=int, default=0, help="Duration hint (bottom-right)"
    )
    parser.add_argument(
        "--output", type=str, default="demo-output/title.png", help="Output PNG path"
    )
    parser.add_argument(
        "--batch", action="store_true", help="Generate all titles from DEMO-TITLES.json"
    )
    args = parser.parse_args()

    os.makedirs("demo-output", exist_ok=True)

    if args.batch:
        batch_generate()
    elif args.title:
        generate_title(
            output_path=args.output,
            title=args.title,
            subtitle=args.subtitle,
            chapter=args.chapter,
            duration_sec=args.duration,
        )
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
