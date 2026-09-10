import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [dts({ include: ["src"], entryRoot: "src" })],
	build: {
		lib: {
			entry: resolve(import.meta.dirname, "src/legacy.ts"),
			formats: ["es"],
			fileName: () => "legacy.js",
			cssFileName: "style-legacy",
		},
		cssCodeSplit: false,
		sourcemap: true,
		outDir: "build",
		emptyOutDir: false,
	},
});
