// Auto-discover all images from the folder structure using Vite's import.meta.glob
const imageModules = import.meta.glob<string>(
  "/src/assets/wallpapers/**/*.{webp,jpg,jpeg,png,gif}",
  { eager: true, import: "default" }
);

// Parse all image paths into a structured map
// Path format: /src/assets/imagenes/{theme}/{collection}/{subcollection}/{filename}
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

// Natural sort for filenames with numbers (imagen1, imagen2, ..., imagen10, etc.)
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

// --- Build data from folder structure ---
function buildData() {
  const parsed = parseImagePaths();

  // Group: theme → collection → subcollection → images
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

  // Sort theme names for consistent order
  const themeNames = [...themeMap.keys()].sort();

  for (const themeName of themeNames) {
    const categoryId = toSlug(themeName);
    categories.push({
      id: categoryId,
      title: formatTitle(themeName),
      slug: categoryId,
    });

    const colMap = themeMap.get(themeName)!;
    const collectionNames = [...colMap.keys()].sort();

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

      // Preview pool: collect todos los fondos y elige aleatoriamente en el componente (cartas)
      const previewImages: string[] = subcollections.flatMap((sub) => sub.images.map((img) => img.src));

      const collectionSlug = `${categoryId}-${toSlug(colName)}`;

      collections.push({
        id: collectionSlug,
        slug: collectionSlug,
        title: formatTitle(colName),
        subtitle: `${totalImages} wallpapers`,
        description: `Explore our collection of ${formatTitle(colName).toLowerCase()} wallpapers in HD and 4K resolution. These aesthetic lilazuly wallpapers are perfect for iPhone, Android and desktop screens. Download them for free and give your device a clean minimal look. ${totalImages} high quality wallpapers available.`,
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
