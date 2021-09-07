const { resolve } = require("path");
const { defineConfig } = require("vite");
const pkg = require("./package.json");

module.exports = defineConfig({
  build: {
    outDir: resolve(__dirname, "dist/browser"),
    lib: {
      entry: resolve(__dirname, "src/browser/index.ts"),
      name: pkg.name,
      fileName: (format) => `flipper.browser.${format}.js`
    },
    rollupOptions: {
      external: ["express", "express-ws", "ws", "serialport"],
    },
  },
});
