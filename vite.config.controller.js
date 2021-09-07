const { resolve } = require("path");
const { defineConfig } = require("vite");
const pkg = require("./package.json");

module.exports = defineConfig({
  build: {
    outDir: resolve(__dirname, "dist/controller"),
    lib: {
      entry: resolve(__dirname, "src/middleware/controller.ts"),
      name: pkg.name,
      fileName: (format) => `flipper.controller.${format}.js`
    },
    rollupOptions: {
      external: ["express", "express-ws", "ws", "serialport"],
    },
  },
});
