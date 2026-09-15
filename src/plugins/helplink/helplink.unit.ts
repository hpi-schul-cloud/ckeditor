import { ClassicEditor, Essentials, Paragraph } from "ckeditor5";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HelpLink } from "./helplink";

const DEFAULT_HELP_URL = "/help/confluence/123409350";
const CUSTOM_HELP_URL = "/help/confluence/999999999";

describe("HelpLink plugin", () => {
	let editor: ClassicEditor;

	beforeEach(() => {
		vi.spyOn(window, "open").mockImplementation(() => null);
	});

	afterEach(async () => {
		if (editor) {
			await editor.destroy();
		}
		vi.restoreAllMocks();
	});

	async function createEditor(config?: { helplink?: { url?: string } }): Promise<ClassicEditor> {
		const element = document.createElement("div");
		document.body.appendChild(element);

		return ClassicEditor.create({
			attachTo: element,
			plugins: [Essentials, Paragraph, HelpLink],
			toolbar: ["helplink"],
			licenseKey: "GPL",
			...config,
		});
	}

	it("registers a helplink component factory", async () => {
		editor = await createEditor();

		expect(editor.ui.componentFactory.has("helplink")).toBe(true);
	});

	it("creates a button view for helplink", async () => {
		editor = await createEditor();

		const button = editor.ui.componentFactory.create("helplink");
		button.render();

		expect(button).toBeTruthy();
		expect(button.element?.tagName.toLowerCase()).toBe("button");
	});

	describe("when clicked", () => {
		it("opens the default help URL", async () => {
			editor = await createEditor();
			const button = editor.ui.componentFactory.create("helplink");

			button.fire("execute");

			expect(window.open).toHaveBeenCalledWith(DEFAULT_HELP_URL, "_blank");
		});

		describe("when a custom help URL is configured", () => {
			it("opens the custom help URL", async () => {
				editor = await createEditor({ helplink: { url: CUSTOM_HELP_URL } });
				const button = editor.ui.componentFactory.create("helplink");

				button.fire("execute");

				expect(window.open).toHaveBeenCalledWith(CUSTOM_HELP_URL, "_blank");
			});
		});
	});
});
