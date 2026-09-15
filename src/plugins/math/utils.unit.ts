import { afterEach, describe, expect, it, vi } from "vitest";

import { addDelimiters, extractDelimiters, renderEquation } from "./utils";

describe("extractDelimiters", () => {
	it("extracts an inline equation delimited by \\( \\)", () => {
		expect(extractDelimiters("\\(x^2\\)")).toEqual({ equation: "x^2", display: false });
	});

	it("extracts a display equation delimited by \\[ \\]", () => {
		expect(extractDelimiters("\\[x^2\\]")).toEqual({ equation: "x^2", display: true });
	});

	it("trims surrounding whitespace before checking for delimiters", () => {
		expect(extractDelimiters("  \\(x^2\\)  ")).toEqual({ equation: "x^2", display: false });
	});

	describe("when no delimiters are present", () => {
		it("falls back to the raw, trimmed text as an inline equation", () => {
			expect(extractDelimiters("  x^2  ")).toEqual({ equation: "x^2", display: false });
		});
	});
});

describe("addDelimiters", () => {
	it("wraps an inline equation in \\( \\)", () => {
		expect(addDelimiters("x^2", false)).toBe("\\(x^2\\)");
	});

	it("wraps a display equation in \\[ \\]", () => {
		expect(addDelimiters("x^2", true)).toBe("\\[x^2\\]");
	});
});

describe("renderEquation", () => {
	afterEach(() => {
		delete (globalThis.window as Window & { katex?: unknown }).katex;
		vi.restoreAllMocks();
	});

	describe("when KaTeX is loaded", () => {
		it("delegates to window.katex.render", () => {
			const render = vi.fn();
			(globalThis.window as Window & { katex?: { render: typeof render } }).katex = { render };
			const element = document.createElement("div");

			renderEquation("x^2", element, true);

			expect(render).toHaveBeenCalledWith("x^2", element, { throwOnError: false, displayMode: true });
		});
	});

	describe("when KaTeX is not loaded", () => {
		it("falls back to the raw delimited source", () => {
			delete (globalThis.window as Window & { katex?: unknown }).katex;
			const element = document.createElement("div");

			renderEquation("x^2", element, false);

			expect(element.textContent).toBe("\\(x^2\\)");
		});

		describe("when displayMode is true", () => {
			it("falls back with display delimiters", () => {
				delete (globalThis.window as Window & { katex?: unknown }).katex;
				const element = document.createElement("div");

				renderEquation("x^2", element, true);

				expect(element.textContent).toBe("\\[x^2\\]");
			});
		});
	});
});
