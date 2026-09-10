import { ClassicEditor, Essentials, Paragraph } from "ckeditor5";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Math } from "./math";
import type { MathCommand } from "./mathcommand";

describe("MathCommand", () => {
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

	function command(): MathCommand {
		return editor.commands.get("math") as MathCommand;
	}

	it("is enabled when the selection is in a context that allows an inline formula", async () => {
		editor = await createEditor();

		expect(command().isEnabled).toBe(true);
	});

	it("inserts an inline formula", async () => {
		editor = await createEditor();

		editor.execute("math", "x^2", false);

		expect(editor.getData()).toBe('<p><span class="math-tex">\\(x^2\\)</span></p>');
	});

	it("inserts a display formula", async () => {
		editor = await createEditor();

		editor.execute("math", "x^2", true);

		expect(editor.getData()).toBe('<span class="math-tex">\\[x^2\\]</span>');
	});

	it("reports the equation and display mode of the selected widget as its value", async () => {
		editor = await createEditor();

		editor.execute("math", "x^2", true);

		expect(command().value).toEqual({ equation: "x^2", display: true });
	});

	it("reports a null value when no math widget is selected", async () => {
		editor = await createEditor();

		expect(command().value).toBeNull();
	});

	it("updates the selected widget instead of inserting a duplicate", async () => {
		editor = await createEditor();

		editor.execute("math", "a", false);
		editor.execute("math", "b", true);

		const data = editor.getData();
		expect(data.match(/math-tex/g)).toHaveLength(1);
		expect(data).toBe('<span class="math-tex">\\[b\\]</span>');
	});

	it("keeps the updated widget selected so the command value reflects the new equation", async () => {
		editor = await createEditor();

		editor.execute("math", "a", false);
		editor.execute("math", "b", true);

		expect(command().value).toEqual({ equation: "b", display: true });
	});
});
