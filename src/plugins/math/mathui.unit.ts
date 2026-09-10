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

	it("adds the form view to the balloon when the toolbar button is executed", async () => {
		editor = await createEditor();

		pressButton();

		expect(balloon().visibleView).toBeTruthy();
	});

	it("does not add the form view twice when the button is executed while already visible", async () => {
		editor = await createEditor();

		pressButton();
		const firstView = balloon().visibleView;
		pressButton();

		expect(balloon().visibleView).toBe(firstView);
	});

	it("hides the panel and refocuses the editing view when the form is cancelled", async () => {
		editor = await createEditor();
		const focusSpy = vi.spyOn(editor.editing.view, "focus");

		pressButton();
		const view = balloon().visibleView as MathFormView;
		view.fire("cancel");

		expect(balloon().visibleView).toBeNull();
		expect(focusSpy).toHaveBeenCalled();
	});

	it("does nothing when the panel is hidden and cancel-equivalent handling is triggered again", async () => {
		editor = await createEditor();

		pressButton();
		const view = balloon().visibleView as MathFormView;
		view.fire("cancel");

		expect(() => view.fire("cancel")).not.toThrow();
		expect(balloon().visibleView).toBeNull();
	});

	it("starts with an empty equation and inline mode when nothing is selected", async () => {
		editor = await createEditor();

		pressButton();
		const view = balloon().visibleView as MathFormView;

		expect(view.equation).toBe("");
		expect(view.displayMode).toBe(false);
	});

	it("prefills the form with the selected widget's equation and display mode", async () => {
		editor = await createEditor();
		editor.execute("math", "x^2", true);

		pressButton();
		const view = balloon().visibleView as MathFormView;

		expect(view.equation).toBe("x^2");
		expect(view.displayMode).toBe(true);
	});

	it("inserts a new formula and hides the panel when the form is submitted", async () => {
		editor = await createEditor();

		pressButton();
		const view = balloon().visibleView as MathFormView;
		view.equation = "x^2";
		view.fire("submit");

		expect(editor.getData()).toBe('<p><span class="math-tex">\\(x^2\\)</span></p>');
		expect(balloon().visibleView).toBeNull();
	});

	it("updates the selected formula when the form is submitted while a widget is selected", async () => {
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

	it("does not insert a formula when the form is submitted with an empty equation", async () => {
		editor = await createEditor();

		pressButton();
		const view = balloon().visibleView as MathFormView;
		view.fire("submit");

		expect(editor.getData()).toBe("");
		expect(balloon().visibleView).toBeNull();
	});

	it("reopens the balloon when the view document is clicked while a math widget is selected", async () => {
		editor = await createEditor();
		editor.execute("math", "x^2", false);

		editor.editing.view.document.fire("click");

		expect(balloon().visibleView).toBeTruthy();
	});

	it("does not open the balloon on click when the selection is not on a math widget", async () => {
		editor = await createEditor();

		editor.editing.view.document.fire("click");

		expect(balloon().visibleView).toBeNull();
	});

	it("does not add the form view twice when clicking an already selected widget with the panel open", async () => {
		editor = await createEditor();
		editor.execute("math", "x^2", false);

		editor.editing.view.document.fire("click");
		const firstView = balloon().visibleView;
		editor.editing.view.document.fire("click");

		expect(balloon().visibleView).toBe(firstView);
	});
});
