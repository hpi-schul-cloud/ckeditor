import { ClassicEditor, Essentials, Paragraph } from "ckeditor5";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Math } from "./math";

describe("Math plugin", () => {
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

	it("registers a math component factory", async () => {
		editor = await createEditor();

		expect(editor.ui.componentFactory.has("math")).toBe(true);
	});

	it("creates a button view for math", async () => {
		editor = await createEditor();

		const button = editor.ui.componentFactory.create("math");
		button.render();

		expect(button).toBeTruthy();
		expect(button.element?.tagName.toLowerCase()).toBe("button");
	});

	it("registers the math command", async () => {
		editor = await createEditor();

		expect(editor.commands.get("math")).toBeTruthy();
	});
});
