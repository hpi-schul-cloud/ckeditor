import { vi } from "vitest";

// CKEditor 5 uses DOM APIs that jsdom does not implement.
globalThis.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

globalThis.Range = class Range {
	setStart() {}
	setEnd() {}
	getBoundingClientRect() {
		return { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 } as DOMRect;
	}
	getClientRects() {
		return [] as unknown as DOMRectList;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// SVG imports are mocked so tests don't need a real SVG loader.
vi.mock("**/*.svg?raw", () => {
	return { default: '<svg xmlns="http://www.w3.org/2000/svg"></svg>' };
});
