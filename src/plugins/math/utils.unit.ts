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

	describe("when delimiters are not anchored to the start and end", () => {
		it("does not strip delimiters that only appear in the middle of the text", () => {
			expect(extractDelimiters("prefix \\(x^2\\) suffix")).toEqual({
				equation: "prefix \\(x^2\\) suffix",
				display: false,
			});
		});

		it("does not strip a trailing delimiter without a matching opening one", () => {
			expect(extractDelimiters("x^2\\)")).toEqual({ equation: "x^2\\)", display: false });
		});
	});

	describe("when the delimiter types are mismatched", () => {
		it("does not strip an inline opening delimiter paired with a display closing delimiter", () => {
			expect(extractDelimiters("\\(x^2\\]")).toEqual({ equation: "\\(x^2\\]", display: false });
		});
	});

	describe("when the equation spans multiple lines", () => {
		it("extracts a multi-line inline equation", () => {
			expect(extractDelimiters("\\(x^2 +\ny^2\\)")).toEqual({ equation: "x^2 +\ny^2", display: false });
		});

		it("extracts a multi-line display equation", () => {
			expect(extractDelimiters("\\[x^2 +\ny^2\\]")).toEqual({ equation: "x^2 +\ny^2", display: true });
		});
	});

	describe("when the equation contains nested or repeated escaped delimiters", () => {
		it("only strips the outermost inline delimiters", () => {
			expect(extractDelimiters("\\(\\(x^2\\)\\)")).toEqual({ equation: "\\(x^2\\)", display: false });
		});

		it("only strips the outermost delimiters when multiple equations are concatenated", () => {
			expect(extractDelimiters("\\(x^2\\) \\(y^2\\)")).toEqual({ equation: "x^2\\) \\(y^2", display: false });
		});

		it("keeps inline delimiters nested inside a display equation intact", () => {
			expect(extractDelimiters("\\[x^2 \\(y^2\\) z\\]")).toEqual({
				equation: "x^2 \\(y^2\\) z",
				display: true,
			});
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
