import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function regenerateManifest() {
  const result = spawnSync(
    process.execPath,
    [path.resolve(__dirname, "scripts/generate_wallpapers_manifest.mjs")],
    { stdio: "inherit" }
  );
  if (result.status !== 0) {
    console.warn("[wallpapers-manifest] generation failed");
  }
}

function wallpapersManifestPlugin() {
  return {
    name: "wallpapers-manifest",
    buildStart() {
      regenerateManifest();
    },
    configureServer(server: { watcher: { add: (p: string) => void; on: (e: string, cb: (p: string) => void) => void } }) {
      const dir = path.resolve(__dirname, "public/wallpapers");
      server.watcher.add(dir);
      const onChange = (file: string) => {
        if (file.includes(`${path.sep}public${path.sep}wallpapers${path.sep}`)) {
          regenerateManifest();
        }
      };
      server.watcher.on("add", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [wallpapersManifestPlugin(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Inline very small assets only; emit anything bigger as separate files
    assetsInlineLimit: 4096,
  },
}));
