const { resolve } = require("path");
const { defineConfig } = require("vite");
const pkg = require("./package.json");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: pkg.name,
      fileName: (format) => `flipper.${format}.js`
    },
    rollupOptions: {
      external: ["express", "express-ws", "ws", "serialport"],
    },
  },
});
