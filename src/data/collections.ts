// Wallpapers are served as static files from /public/wallpapers.
// A build-time script (scripts/generate_wallpapers_manifest.mjs) scans the
// folder and emits this JSON. This avoids Vite's vite:asset plugin processing
// hundreds of large images on every build.
import manifest from "./wallpapers-manifest.json";

interface ParsedImage {
  collection: string;
  subcollection: string;
  subsubcollection: string;
  color: string;
  filename: string;
  src: string;
}

function parseImagePaths(): ParsedImage[] {
  return manifest as ParsedImage[];
}

// Natural sort for filenames with numbers
function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

// Format folder name into readable title: "gradient_amarillo" → "Gradient Amarillo"
function formatTitle(folderName: string): string {
  return folderName
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Generate a URL-friendly slug from folder name
function toSlug(name: string): string {
  return name.replace(/_/g, "-").toLowerCase();
}

export interface WallpaperImage {
  id: string;
  src: string;
  alt: string;
}

/** A color group (e.g. "blue") with its wallpaper images */
export interface ColorGroup {
  id: string;
  slug: string;         // e.g. "blue"
  anchorId: string;
  title: string;
  url: string;          // /collections/{collection}/{subcategory}/{color}
  images: WallpaperImage[];
}

/** A sub-subcollection (e.g. "basic") — used as the "subcategory" in URLs */
export interface SubSubcollection {
  id: string;
  slug: string;               // legacy full slug e.g. "ballon-initial-basic"
  subcategorySlug: string;    // short slug e.g. "basic"
  anchorId: string;
  title: string;
  collectionTitle: string;
  collectionSlug: string;
  colorGroups: ColorGroup[];
  downloadLink: string;
}

/** A subcollection (e.g. "solid") containing sub-subcollections */
export interface Subcollection {
  id: string;
  anchorId: string;
  title: string;
  subsubcollections: SubSubcollection[];
}

/** A collection (e.g. "ballon_initial") — the top-level grouping */
export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  previewImages: string[];
  subcollections: Subcollection[];
}

// --- Build data from folder structure ---
function buildData() {
  const parsed = parseImagePaths();

  // Group: collection → subcollection → subsubcollection → color → images
  type ColorMap = Map<string, ParsedImage[]>;
  type SubSubMap = Map<string, ColorMap>;
  type SubMap = Map<string, SubSubMap>;
  type CollectionMap = Map<string, SubMap>;

  const collectionMap: CollectionMap = new Map();

  for (const img of parsed) {
    if (!collectionMap.has(img.collection)) collectionMap.set(img.collection, new Map());
    const subMap = collectionMap.get(img.collection)!;
    if (!subMap.has(img.subcollection)) subMap.set(img.subcollection, new Map());
    const subSubMap = subMap.get(img.subcollection)!;
    if (!subSubMap.has(img.subsubcollection)) subSubMap.set(img.subsubcollection, new Map());
    const colorMap = subSubMap.get(img.subsubcollection)!;
    if (!colorMap.has(img.color)) colorMap.set(img.color, []);
    colorMap.get(img.color)!.push(img);
  }

  const collections: Collection[] = [];
  const collectionNames = [...collectionMap.keys()].sort();

  for (const colName of collectionNames) {
    const subMap = collectionMap.get(colName)!;
    const subNames = [...subMap.keys()].sort();
    const allPreviewImages: string[] = [];
    let totalImages = 0;

    const subcollections: Subcollection[] = [];

    for (const subName of subNames) {
      const subSubMap = subMap.get(subName)!;
      const subSubNames = [...subSubMap.keys()].sort();

      const subsubcollections: SubSubcollection[] = [];

      for (const subSubName of subSubNames) {
        const colorMap = subSubMap.get(subSubName)!;
        const colorNames = [...colorMap.keys()].sort();

        const colorGroups: ColorGroup[] = [];

        for (const colorName of colorNames) {
          const imgs = colorMap.get(colorName)!;
          imgs.sort((a, b) => naturalSort(a.filename, b.filename));
          totalImages += imgs.length;

          const colorId = `${toSlug(colName)}-${toSlug(subName)}-${toSlug(subSubName)}-${toSlug(colorName)}`;

          const colorSlug = toSlug(colorName);
          const collectionSlugLocal = toSlug(colName);
          const subcategorySlugLocal = toSlug(subSubName);

          const wallpaperImages = imgs.map((img, i) => ({
            id: `${colorId}-${i}`,
            src: img.src,
            alt: `${formatTitle(colorName)} ${formatTitle(subSubName)} ${formatTitle(subName)} aesthetic wallpaper ${i + 1}`,
          }));

          allPreviewImages.push(...wallpaperImages.map((w) => w.src));

          colorGroups.push({
            id: colorId,
            slug: colorSlug,
            anchorId: `${toSlug(subSubName)}-${toSlug(colorName)}`,
            title: formatTitle(colorName),
            url: `/collections/${collectionSlugLocal}/${subcategorySlugLocal}/${colorSlug}`,
            images: wallpaperImages,
          });
        }

        const subsubSlug = `${toSlug(colName)}-${toSlug(subSubName)}`;
        subsubcollections.push({
          id: `${toSlug(colName)}-${toSlug(subName)}-${toSlug(subSubName)}`,
          slug: subsubSlug,
          subcategorySlug: toSlug(subSubName),
          anchorId: `${toSlug(subName)}-${toSlug(subSubName)}`,
          title: formatTitle(subSubName),
          collectionTitle: formatTitle(colName),
          collectionSlug: toSlug(colName),
          colorGroups,
          downloadLink: "https://daross.gumroad.com/l/glow-wallpapers-all-collections",
        });
      }

      subcollections.push({
        id: `${toSlug(colName)}-${toSlug(subName)}`,
        anchorId: toSlug(subName),
        title: formatTitle(subName),
        subsubcollections,
      });
    }

    const collectionSlug = toSlug(colName);

    collections.push({
      id: collectionSlug,
      slug: collectionSlug,
      title: formatTitle(colName),
      subtitle: `${totalImages} wallpapers`,
      description: `Explore our ${formatTitle(colName)} wallpaper collection in HD and 4K resolution. ${totalImages} high quality wallpapers available for free download.`,
      previewImages: allPreviewImages,
      subcollections,
    });
  }

  return { collections };
}

const data = buildData();

export const collections = data.collections;

export const getCollectionBySlug = (slug: string) =>
  collections.find((c) => c.slug === slug);

export const getSubSubcollectionBySlug = (slug: string): SubSubcollection | undefined => {
  for (const col of collections) {
    for (const sub of col.subcollections) {
      for (const subsub of sub.subsubcollections) {
        if (subsub.slug === slug) return subsub;
      }
    }
  }
  return undefined;
};

export interface ColorPageContext {
  collection: Collection;
  subcollection: Subcollection;
  subsubcollection: SubSubcollection;
  colorGroup: ColorGroup;
}

/** Look up a color page by URL params: /collections/{collection}/{subcategory}/{color} */
export const getColorPage = (
  collectionSlug: string,
  subcategorySlug: string,
  colorSlug: string,
): ColorPageContext | undefined => {
  const collection = collections.find((c) => c.slug === collectionSlug);
  if (!collection) return undefined;
  for (const sub of collection.subcollections) {
    for (const subsub of sub.subsubcollections) {
      if (subsub.subcategorySlug !== subcategorySlug) continue;
      const cg = subsub.colorGroups.find((g) => g.slug === colorSlug);
      if (cg) return { collection, subcollection: sub, subsubcollection: subsub, colorGroup: cg };
    }
  }
  return undefined;
};

/** All color pages — useful for sitemap / listings */
export const getAllColorPages = (): ColorPageContext[] => {
  const out: ColorPageContext[] = [];
  for (const collection of collections) {
    for (const subcollection of collection.subcollections) {
      for (const subsubcollection of subcollection.subsubcollections) {
        for (const colorGroup of subsubcollection.colorGroups) {
          out.push({ collection, subcollection, subsubcollection, colorGroup });
        }
      }
    }
  }
  return out;
};
