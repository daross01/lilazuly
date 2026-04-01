"""
Generates public/sitemap.xml from the folder structure in src/assets/wallpapers/.

Parses folder structure and builds URLs for:
  - Homepage
  - Each collection page: /collection/{slug}
  - Each subcollection anchor: /collection/{slug}#{anchor}

Usage:
    python scripts/generate_sitemap.py

Configuration:
    Set DOMAIN below to your production domain.
"""

import os
import re
from datetime import date

DOMAIN = "https://lilazuly.vercel.app"
WALLPAPERS_DIR = "src/assets/wallpapers"
OUTPUT = "public/sitemap.xml"


def to_slug(name: str) -> str:
    """Generate a URL-friendly slug from folder name"""
    return name.replace("_", "-").lower()


def parse_wallpapers_structure(root_dir: str):
    """Extract collection slugs and subcollection anchor IDs from folder structure."""
    slugs = []
    anchors = set()

    if not os.path.exists(root_dir):
        return slugs, list(anchors)

    # Walk through the directory structure
    for theme_dir in os.listdir(root_dir):
        theme_path = os.path.join(root_dir, theme_dir)
        if not os.path.isdir(theme_path):
            continue

        theme_slug = to_slug(theme_dir)

        for collection_dir in os.listdir(theme_path):
            collection_path = os.path.join(theme_path, collection_dir)
            if not os.path.isdir(collection_path):
                continue

            collection_slug = f"{theme_slug}-{to_slug(collection_dir)}"
            slugs.append(collection_slug)

            # Get subcollection anchors
            for subcollection_dir in os.listdir(collection_path):
                subcollection_path = os.path.join(collection_path, subcollection_dir)
                if os.path.isdir(subcollection_path):
                    anchors.add(to_slug(subcollection_dir))

    return slugs, list(anchors)


def generate_sitemap(slugs: list, anchors: list):
    today = date.today().isoformat()

    urls = []

    # Homepage
    urls.append(f"""  <url>
    <loc>{DOMAIN}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>""")

    # Static pages
    for page in ["privacy", "terms"]:
        urls.append(f"""  <url>
    <loc>{DOMAIN}/{page}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>""")

    # Collection pages
    for slug in sorted(slugs):
        urls.append(f"""  <url>
    <loc>{DOMAIN}/collection/{slug}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>
"""
    return xml


def main():
    if not os.path.exists(WALLPAPERS_DIR):
        print(f"Error: {WALLPAPERS_DIR} not found. Run from project root.")
        return

    slugs, anchors = parse_wallpapers_structure(WALLPAPERS_DIR)

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

    sitemap = generate_sitemap(slugs, anchors)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(sitemap)

    print(f"✅ Sitemap generated: {OUTPUT}")
    print(f"   {len(slugs)} collection URLs + homepage + static pages")


if __name__ == "__main__":
    main()
