// Scans public/wallpapers and emits src/data/wallpapers-manifest.json
// Path format: public/wallpapers/{collection}/{subcollection}/{subsubcollection}/{color}/{filename}
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const WALLPAPERS_DIR = join(ROOT, "public", "wallpapers");
const OUT_FILE = join(ROOT, "src", "data", "wallpapers-manifest.json");

const IMG_EXT = /\.(webp|jpe?g|png|gif)$/i;

function walk(dir) {
  const entries = [];
  if (!existsSync(dir)) return entries;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) entries.push(...walk(full));
    else if (IMG_EXT.test(name)) entries.push(full);
  }
  return entries;
}

const files = walk(WALLPAPERS_DIR);
const manifest = [];

for (const f of files) {
  const rel = relative(WALLPAPERS_DIR, f).split(/[\\/]/);
  if (rel.length !== 5) continue;
  const [collection, subcollection, subsubcollection, color, filename] = rel;
  manifest.push({
    collection,
    subcollection,
    subsubcollection,
    color,
    filename,
    src: "/wallpapers/" + rel.join("/"),
  });
}

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 0));
console.log(`[wallpapers-manifest] ${manifest.length} images → ${relative(ROOT, OUT_FILE)}`);
