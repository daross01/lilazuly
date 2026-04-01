"""
Reads src/data/collections.ts, extracts theme/collection/subcollection slugs,
and creates the matching folder structure under src/assets/wallpapers/.

Usage:
    python scripts/create_image_folders.py
"""

import os
import re

COLLECTIONS_FILE = "src/data/collections.ts"
BASE_FOLDER = "src/assets/wallpapers"


def extract_slugs(filepath: str):
    """Parse collections.ts and extract folder-relevant slug info."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # The folder structure is: wallpapers/{theme}/{collection}/{subcollection}/
    # We parse the buildData output by looking at existing patterns.
    # Since the data is auto-generated from folders, this script helps
    # bootstrap NEW folders when you want to add content.

    # Extract theme (category) slugs
    themes = re.findall(r'id:\s*["\']([^"\']+)["\']', content)
    # Extract collection names from slug patterns like "theme-collection"
    collection_ids = re.findall(r'slug:\s*["\']([^"\']+)["\']', content)

    return themes, collection_ids


def main():
    if not os.path.exists(COLLECTIONS_FILE):
        print(f"Error: {COLLECTIONS_FILE} not found. Run from project root.")
        return

    themes, collection_ids = extract_slugs(COLLECTIONS_FILE)

    # Parse collection slugs to derive theme/collection pairs
    created = []
    for slug in collection_ids:
        parts = slug.split("-", 1)
        if len(parts) == 2:
            theme, collection = parts
            # Create a default subcollection folder
            folder = os.path.join(BASE_FOLDER, theme, collection, "default")
            os.makedirs(folder, exist_ok=True)
            created.append(folder)

    # Also ensure all theme folders exist
    for theme in set(themes):
        folder = os.path.join(BASE_FOLDER, theme)
        os.makedirs(folder, exist_ok=True)
        if folder not in created:
            created.append(folder)

    if created:
        print(f"✅ Created {len(created)} folders:")
        for f in sorted(set(created)):
            print(f"   {f}")
    else:
        print("No folders to create.")


if __name__ == "__main__":
    main()

