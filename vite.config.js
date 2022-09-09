import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    __MODULE_VERSION__: process.env.npm_package_version,
  },
  build: {
    lib: {
      entry: resolve("./src/main.ts"),
      name: '@ebondioli/flipper',
      fileName: (format) => `flipper.${format}.js`
    },
    rollupOptions: {
      external: ["express", "express-ws", "ws", "serialport"],
    },
  },
});
