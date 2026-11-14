#!/usr/bin/env python3
"""Fetch CC-licensed photographic stand-ins (Openverse / Wikimedia) for the
Ghamdan build. These are DRAFT STAND-INS only — real Ghamdan photos are
pending client input (CI-06). Every photo is labelled as a stand-in in the
site footer/dev note and listed in docs/PHOTO_CREDITS.md with its source
and licence. No reference screenshot is used as an image.
Usage: python3 tools/fetch_photos.py
"""
import json, urllib.request, urllib.parse, io, sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/img/photos"
OUT.mkdir(parents=True, exist_ok=True)

# name -> (openverse query, min width)
WANTED = [
    ("hero-villa", "modern house rooftop solar panels blue sky", 1600),
    ("hero-field", "solar panel farm field mountains blue sky", 1600),
    ("hero-pump", "solar water pump irrigation", 1600),
    ("villa-roof", "solar panels roof house", 1400),
    ("field-sunset", "solar panels sunset field", 1400),
    ("pump-water", "water pump gushing irrigation", 1400),
    ("greenhouse", "greenhouse drip irrigation agriculture", 1400),
    ("pivot", "center pivot irrigation field", 1400),
    ("panels-close", "solar panels close up blue", 1400),
    ("tank", "water tank tower rural", 1200),
    ("solar-pergola", "solar pergola panels", 1200),
    ("pump-station", "water pump station well", 1200),
    ("crops", "green crops field irrigation", 1400),
    ("panels-row", "solar panels rows ground", 1400),
]

UA = {"User-Agent": "GhamdanBuild/1.0 (contact: info@ghamdan-trd.com)"}

def search(query):
    url = ("https://api.openverse.org/v1/images/?q=" + urllib.parse.quote(query)
           + "&license_type=commercial&page_size=8&filter_dead=false")
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["results"]

credits = []
for name, query, minw in WANTED:
    dest = OUT / f"{name}.jpg"
    if dest.exists():
        print(f"skip {name} (exists)")
        continue
    try:
        results = search(query)
    except Exception as e:
        print(f"FAIL search {name}: {e}")
        continue
    got = None
    for res in results:
        w = res.get("width") or 0
        if w and w < 1000:
            continue
        img_url = res.get("foreign_landing_url") and res.get("url")
        if not img_url:
            continue
        try:
            req = urllib.request.Request(img_url, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as r:
                raw = r.read()
            im = Image.open(io.BytesIO(raw)).convert("RGB")
            if im.width < 1000:
                continue
            # resize to max 1600w, save quality 80
            if im.width > 1600:
                im = im.resize((1600, int(im.height * 1600 / im.width)), Image.LANCZOS)
            im.save(dest, "JPEG", quality=80, optimize=True)
            got = res
            print(f"OK {name}: {im.width}x{im.height} from {res.get('license')} {res.get('creator')}")
            break
        except Exception as e:
            print(f"  try failed {name}: {e}")
            continue
    if got:
        credits.append({
            "file": f"{name}.jpg", "query": query,
            "title": got.get("title"), "creator": got.get("creator"),
            "license": got.get("license"), "license_url": got.get("license_url"),
            "source": got.get("foreign_landing_url"),
        })
    else:
        print(f"FAIL {name}: no usable image")

credits_path = ROOT / "docs/PHOTO_CREDITS.md"
lines = ["# Photo credits — draft stand-ins (CI-06)\n",
         "All photos below are CC-licensed stand-ins fetched from Openverse. They are NOT",
         "Ghamdan's real photos. Real product/project photos are pending client input (CI-06).",
         "Each is labelled on the site as a development stand-in. Replace with client photos",
         "when received; this file must be updated at the same time.\n"]
for c in credits:
    lines.append(f"- `{c['file']}` — “{c['title']}” by {c['creator']}, {c['license']} — {c['source']}")
credits_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"credits: {len(credits)} written to docs/PHOTO_CREDITS.md")
