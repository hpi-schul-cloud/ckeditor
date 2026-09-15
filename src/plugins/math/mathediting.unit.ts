import { ClassicEditor, Essentials, Paragraph } from "ckeditor5";
import type { ModelElement } from "ckeditor5";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MathEditing } from "./mathediting";

describe("MathEditing", () => {
	let editor: ClassicEditor;

	beforeEach(() => {
		// The math UI calls window.katex.render during preview; provide a stub.
		(globalThis.window as Window & { katex?: { render: () => void } }).katex = {
			render: vi.fn(),
		};
	});

	afterEach(async () => {
		if (editor) {
			await editor.destroy();
		}
		vi.restoreAllMocks();
	});

	async function createEditor(): Promise<ClassicEditor> {
		const element = document.createElement("div");
		document.body.appendChild(element);

		return ClassicEditor.create({
			attachTo: element,
			plugins: [Essentials, Paragraph, MathEditing],
			licenseKey: "GPL",
		});
	}

	describe("schema", () => {
		it("registers mathtex-inline as an inline object allowed wherever text is allowed", async () => {
			editor = await createEditor();
			const { schema } = editor.model;

			expect(schema.isRegistered("mathtex-inline")).toBe(true);
			expect(schema.isInline("mathtex-inline")).toBe(true);
			expect(schema.isObject("mathtex-inline")).toBe(true);
		});

		it("registers mathtex-display as a non-inline object", async () => {
			editor = await createEditor();
			const { schema } = editor.model;

			expect(schema.isRegistered("mathtex-display")).toBe(true);
			expect(schema.isInline("mathtex-display")).toBe(false);
			expect(schema.isObject("mathtex-display")).toBe(true);
		});
	});

	describe("upcast conversion", () => {
		it("converts an inline math-tex span into a mathtex-inline element", async () => {
			editor = await createEditor();

			editor.setData('<p><span class="math-tex">\\(x^2\\)</span></p>');

			const root = editor.model.document.getRoot()!;
			const paragraph = root.getChild(0) as ModelElement;
			const mathElement = paragraph.getChild(0)!;

			expect(mathElement.is("element", "mathtex-inline")).toBe(true);
			expect(mathElement.getAttribute("equation")).toBe("x^2");
			expect(mathElement.getAttribute("display")).toBe(false);
		});

		it("converts a display math-tex span into a mathtex-display element", async () => {
			editor = await createEditor();

			editor.setData('<p><span class="math-tex">\\[x^2\\]</span></p>');

			const root = editor.model.document.getRoot()!;
			const mathElement = root.getChild(0)!;

			expect(mathElement.is("element", "mathtex-display")).toBe(true);
			expect(mathElement.getAttribute("equation")).toBe("x^2");
			expect(mathElement.getAttribute("display")).toBe(true);
		});

		it("skips a math-tex span without a text child and warns", async () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			editor = await createEditor();

			editor.setData('<p><span class="math-tex"></span>content</p>');

			expect(editor.getData()).toBe("<p>content</p>");
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining("Skipped a .math-tex element without a text child.")
			);
		});

		it("drops legacy script type=math/tex formulas and warns", async () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			editor = await createEditor();

			editor.setData('<p>before</p><script type="math/tex">x^2</script>');

			// The script element itself is dropped; it is never converted into a math widget.
			expect(editor.getData()).not.toContain("math-tex");
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Dropping unsupported legacy <script type="math/tex"> formula:'),
				"x^2"
			);
		});
	});

	describe("downcast conversion", () => {
		it("round-trips an inline formula through data downcast", async () => {
			editor = await createEditor();

			editor.setData('<p><span class="math-tex">\\(x^2\\)</span></p>');

			expect(editor.getData()).toBe('<p><span class="math-tex">\\(x^2\\)</span></p>');
		});

		it("round-trips a display formula through data downcast", async () => {
			editor = await createEditor();

			editor.setData('<span class="math-tex">\\[x^2\\]</span>');

			expect(editor.getData()).toBe('<span class="math-tex">\\[x^2\\]</span>');
		});

		it("renders an editing view widget with the ck-math-tex class", async () => {
			editor = await createEditor();

			editor.setData('<p><span class="math-tex">\\(x^2\\)</span></p>');

			const domRoot = editor.editing.view.getDomRoot()!;
			expect(domRoot.querySelector(".ck-math-tex")).toBeTruthy();
			expect(domRoot.querySelector(".ck-math-tex-inline")).toBeTruthy();
		});

		it("renders a display editing view widget with a block container", async () => {
			editor = await createEditor();

			editor.setData('<span class="math-tex">\\[x^2\\]</span>');

			const domRoot = editor.editing.view.getDomRoot()!;
			const display = domRoot.querySelector(".ck-math-tex-display");
			expect(display).toBeTruthy();
			expect(display?.tagName.toLowerCase()).toBe("div");
		});
	});
});
