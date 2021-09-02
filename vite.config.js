const { resolve } = require("path");
const { defineConfig } = require("vite");
const pkg = require("./package.json");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: pkg.name,
    },
    rollupOptions: {
      external: ["express", "express-ws", "ws", "serialport"],
      input: {
        flipper: resolve(__dirname, "src/main.ts"),
        "client/index": resolve(__dirname, "src/browser/client.ts"),
        "simulator/index": resolve(__dirname, "src/browser/simulator.ts"),
        "controller/index": resolve(__dirname, "src/middleware/controller.ts"),
      },
      output: [
        {
          entryFileNames: (entry) => `${entry.name}.es.js`,
          format: "es",
          dir: resolve(__dirname, "dist"),
        },
        {
          entryFileNames: (entry) => `${entry.name}.cjs.js`,
          format: "commonjs",
          exports: "named",
          dir: resolve(__dirname, "dist"),
        },
      ],
    },
  },
});
