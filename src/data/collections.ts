// Auto-discover all images from the folder structure using Vite's import.meta.glob
const imageModules = import.meta.glob<string>(
  "/src/assets/wallpapers/**/*.{webp,jpg,jpeg,png,gif}",
  { eager: true, import: "default" }
);

interface ParsedImage {
  theme: string;
  collection: string;
  subcollection: string;
  filename: string;
  src: string;
}

function parseImagePaths(): ParsedImage[] {
  const images: ParsedImage[] = [];
  for (const [path, src] of Object.entries(imageModules)) {
    const parts = path.replace("/src/assets/wallpapers/", "").split("/");
    if (parts.length === 4) {
      images.push({
        theme: parts[0],
        collection: parts[1],
        subcollection: parts[2],
        filename: parts[3],
        src,
      });
    }
  }
  return images;
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function formatTitle(folderName: string): string {
  return folderName
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCollectionTitle(folderName: string): string {
  return `${formatTitle(folderName)} Collection`;
}

function formatCategoryTitle(folderName: string): string {
  return `${formatTitle(folderName)} Collection`;
}

function toSlug(name: string): string {
  return name.replace(/_/g, "-").toLowerCase();
}

export interface WallpaperImage {
  id: string;
  src: string;
  alt: string;
}

export interface Subcollection {
  id: string;
  anchorId: string;
  title: string;
  downloadLink: string;
  images: WallpaperImage[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  previewImages: string[];
  subcollections: Subcollection[];
}

export interface Category {
  id: string;
  title: string;
  slug: string;
}

export interface ColorConfig {
  id: string;
  name: string;
}

export const COLOR_ORDER: ColorConfig[] = [
  { id: "lake", name: "Lake" },
  { id: "ocean", name: "Ocean" },
  { id: "salvia", name: "Salvia" },
  { id: "malva", name: "Malva" },
  { id: "coral", name: "Coral" },
  { id: "terracotta", name: "Terracotta" },
  { id: "taupe", name: "Taupe" },
  { id: "ash", name: "Ash" },
  { id: "marfil", name: "Marfil" },
];

// Fixed collection display order
const COLLECTION_ORDER = [
  "color-pop",
  "heart-glow",
  "soft-love",
  "pure-initial",
];

function buildData() {
  const parsed = parseImagePaths();

  const themeMap = new Map<string, Map<string, Map<string, ParsedImage[]>>>();

  for (const img of parsed) {
    if (!themeMap.has(img.theme)) themeMap.set(img.theme, new Map());
    const colMap = themeMap.get(img.theme)!;
    if (!colMap.has(img.collection)) colMap.set(img.collection, new Map());
    const subMap = colMap.get(img.collection)!;
    if (!subMap.has(img.subcollection)) subMap.set(img.subcollection, []);
    subMap.get(img.subcollection)!.push(img);
  }

  const categories: Category[] = [];
  const collections: Collection[] = [];

  const themeNames = [...themeMap.keys()].sort();

  for (const themeName of themeNames) {
    const categoryId = toSlug(themeName);
    categories.push({
      id: categoryId,
      title: formatCategoryTitle(themeName),
      slug: categoryId,
    });

    const colMap = themeMap.get(themeName)!;
    const collectionNames = [...colMap.keys()];

    // Sort collections by COLLECTION_ORDER
    collectionNames.sort((a, b) => {
      const aSlug = toSlug(a);
      const bSlug = toSlug(b);
      const aIdx = COLLECTION_ORDER.indexOf(aSlug);
      const bIdx = COLLECTION_ORDER.indexOf(bSlug);
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });

    for (const colName of collectionNames) {
      const subMap = colMap.get(colName)!;
      const subcollectionNames = [...subMap.keys()].sort();

      const subcollections: Subcollection[] = [];
      let totalImages = 0;

      for (const subName of subcollectionNames) {
        const imgs = subMap.get(subName)!;
        imgs.sort((a, b) => naturalSort(a.filename, b.filename));
        totalImages += imgs.length;

        subcollections.push({
          id: `${categoryId}-${toSlug(colName)}-${toSlug(subName)}`,
          anchorId: toSlug(subName),
          title: formatTitle(subName),
          downloadLink: "https://daross.gumroad.com/l/glow-wallpapers-all-collections",
          images: imgs.map((img, i) => ({
            id: `${toSlug(subName)}-${i}`,
            src: img.src,
            alt: `${formatTitle(subName)} ${formatTitle(colName)} aesthetic wallpaper for iPhone ${i + 1}`,
          })),
        });
      }

      const previewImages: string[] = subcollections.flatMap((sub) => sub.images.map((img) => img.src));
      const collectionSlug = `${categoryId}-${toSlug(colName)}`;

      collections.push({
        id: collectionSlug,
        slug: collectionSlug,
        title: formatTitle(colName),
        subtitle: `${totalImages} wallpapers`,
        description: `Explore our ${formatTitle(colName).toLowerCase()} wallpapers in HD and 4K resolution. These aesthetic DeluneVibes wallpapers are perfect for iPhone, Android and desktop screens. Download them for free and give your device a clean minimal look. ${totalImages} high quality wallpapers available.`,
        categoryId,
        previewImages,
        subcollections,
      });
    }
  }

  return { categories, collections };
}

const data = buildData();

export const categories = data.categories;
export const collections = data.collections;

export const getCollectionsByCategory = (categoryId: string) =>
  collections.filter((c) => c.categoryId === categoryId);

export const getCollectionBySlug = (slug: string) =>
  collections.find((c) => c.slug === slug);

export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id);
