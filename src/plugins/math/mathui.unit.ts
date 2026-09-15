import { ClassicEditor, ContextualBalloon, Essentials, Paragraph } from "ckeditor5";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Math } from "./math";
import type { MathFormView } from "./ui/mathformview";

describe("MathUI", () => {
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
			plugins: [Essentials, Paragraph, Math],
			toolbar: ["math"],
			licenseKey: "GPL",
		});
	}

	function balloon() {
		return editor.plugins.get(ContextualBalloon);
	}

	function pressButton() {
		const button = editor.ui.componentFactory.create("math");
		button.render();
		button.fire("execute");
	}

	describe("when the toolbar button is executed", () => {
		it("adds the form view to the balloon", async () => {
			editor = await createEditor();

			pressButton();

			expect(balloon().visibleView).toBeTruthy();
		});

		describe("when the panel is already visible", () => {
			it("does not add the form view twice", async () => {
				editor = await createEditor();

				pressButton();
				const firstView = balloon().visibleView;
				pressButton();

				expect(balloon().visibleView).toBe(firstView);
			});
		});
	});

	describe("when the form is cancelled", () => {
		it("hides the panel and refocuses the editing view", async () => {
			editor = await createEditor();
			const focusSpy = vi.spyOn(editor.editing.view, "focus");

			pressButton();
			const view = balloon().visibleView as MathFormView;
			view.fire("cancel");

			expect(balloon().visibleView).toBeNull();
			expect(focusSpy).toHaveBeenCalled();
		});

		describe("when the panel is already hidden", () => {
			it("does nothing", async () => {
				editor = await createEditor();

				pressButton();
				const view = balloon().visibleView as MathFormView;
				view.fire("cancel");

				expect(() => view.fire("cancel")).not.toThrow();
				expect(balloon().visibleView).toBeNull();
			});
		});
	});

	describe("when opening the form", () => {
		describe("when nothing is selected", () => {
			it("starts with an empty equation and inline mode", async () => {
				editor = await createEditor();

				pressButton();
				const view = balloon().visibleView as MathFormView;

				expect(view.equation).toBe("");
				expect(view.displayMode).toBe(false);
			});
		});

		describe("when a math widget is selected", () => {
			it("prefills the form with the selected widget's equation and display mode", async () => {
				editor = await createEditor();
				editor.execute("math", "x^2", true);

				pressButton();
				const view = balloon().visibleView as MathFormView;

				expect(view.equation).toBe("x^2");
				expect(view.displayMode).toBe(true);
			});
		});
	});

	describe("when the form is submitted", () => {
		it("inserts a new formula and hides the panel", async () => {
			editor = await createEditor();

			pressButton();
			const view = balloon().visibleView as MathFormView;
			view.equation = "x^2";
			view.fire("submit");

			expect(editor.getData()).toBe('<p><span class="math-tex">\\(x^2\\)</span></p>');
			expect(balloon().visibleView).toBeNull();
		});

		describe("when a widget is selected", () => {
			it("updates the selected formula", async () => {
				editor = await createEditor();
				editor.execute("math", "a", false);

				pressButton();
				const view = balloon().visibleView as MathFormView;
				view.equation = "b";
				view.displayMode = true;
				view.fire("submit");

				const data = editor.getData();
				expect(data.match(/math-tex/g)).toHaveLength(1);
				expect(data).toBe('<span class="math-tex">\\[b\\]</span>');
			});
		});

		describe("when the equation is empty", () => {
			it("does not insert a formula", async () => {
				editor = await createEditor();

				pressButton();
				const view = balloon().visibleView as MathFormView;
				view.fire("submit");

				expect(editor.getData()).toBe("");
				expect(balloon().visibleView).toBeNull();
			});
		});
	});

	describe("when the view document is clicked", () => {
		describe("while a math widget is selected", () => {
			it("reopens the balloon", async () => {
				editor = await createEditor();
				editor.execute("math", "x^2", false);

				editor.editing.view.document.fire("click");

				expect(balloon().visibleView).toBeTruthy();
			});

			describe("when the panel is already open for that widget", () => {
				it("does not add the form view twice", async () => {
					editor = await createEditor();
					editor.execute("math", "x^2", false);

					editor.editing.view.document.fire("click");
					const firstView = balloon().visibleView;
					editor.editing.view.document.fire("click");

					expect(balloon().visibleView).toBe(firstView);
				});
			});
		});

		describe("when the selection is not on a math widget", () => {
			it("does not open the balloon", async () => {
				editor = await createEditor();

				editor.editing.view.document.fire("click");

				expect(balloon().visibleView).toBeNull();
			});
		});
	});
});
