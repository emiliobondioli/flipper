import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    __MODULE_VERSION__: process.env.npm_package_version,
  },
  build: {
    outDir: resolve("./dist/browser"),
    lib: {
      entry: resolve("./src/browser/index.ts"),
      name: "@ebondioli/flipper",
      fileName: (format) => `flipper.browser.${format}.js`,
    },
    rollupOptions: {
      external: ["express", "express-ws", "ws", "serialport"],
    },
  },
});
