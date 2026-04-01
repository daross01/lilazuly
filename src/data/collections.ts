// Auto-discover all images from the folder structure using Vite's import.meta.glob
const imageModules = import.meta.glob<string>(
  "/src/assets/wallpapers/**/*.{webp,jpg,jpeg,png,gif}",
  { eager: true, import: "default" }
);

// Path format: /src/assets/wallpapers/{collection}/{subcollection}/{subsubcollection}/{color}/{filename}
interface ParsedImage {
  collection: string;
  subcollection: string;
  subsubcollection: string;
  color: string;
  filename: string;
  src: string;
}

function parseImagePaths(): ParsedImage[] {
  const images: ParsedImage[] = [];
  for (const [path, src] of Object.entries(imageModules)) {
    const parts = path.replace("/src/assets/wallpapers/", "").split("/");
    if (parts.length === 5) {
      images.push({
        collection: parts[0],
        subcollection: parts[1],
        subsubcollection: parts[2],
        color: parts[3],
        filename: parts[4],
        src,
      });
    }
  }
  return images;
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
  anchorId: string;
  title: string;
  images: WallpaperImage[];
}

/** A sub-subcollection (e.g. "color_pop") containing 6 color groups */
export interface SubSubcollection {
  id: string;
  slug: string;
  anchorId: string;
  title: string;
  collectionTitle: string;
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

          const wallpaperImages = imgs.map((img, i) => ({
            id: `${colorId}-${i}`,
            src: img.src,
            alt: `${formatTitle(colorName)} ${formatTitle(subSubName)} ${formatTitle(subName)} aesthetic wallpaper ${i + 1}`,
          }));

          allPreviewImages.push(...wallpaperImages.map((w) => w.src));

          colorGroups.push({
            id: colorId,
            anchorId: `${toSlug(subSubName)}-${toSlug(colorName)}`,
            title: formatTitle(colorName),
            images: wallpaperImages,
          });
        }

        const subsubSlug = `${toSlug(colName)}-${toSlug(subSubName)}`;
        subsubcollections.push({
          id: `${toSlug(colName)}-${toSlug(subName)}-${toSlug(subSubName)}`,
          slug: subsubSlug,
          anchorId: `${toSlug(subName)}-${toSlug(subSubName)}`,
          title: formatTitle(subSubName),
          collectionTitle: formatTitle(colName),
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
