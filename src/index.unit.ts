import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ClassicEditor, InlineEditor } from "./index";

describe("Default editor bundle", () => {
	let editor: ClassicEditor | InlineEditor;

	beforeEach(() => {
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

	function createElement(): HTMLDivElement {
		const element = document.createElement("div");
		document.body.appendChild(element);
		return element;
	}

	it("creates a ClassicEditor with default config", async () => {
		editor = await ClassicEditor.create(createElement());

		expect(editor).toBeTruthy();
		expect(editor.locale.uiLanguage).toBe("de");
	});

	it("creates an InlineEditor with default config", async () => {
		editor = await InlineEditor.create(createElement());

		expect(editor).toBeTruthy();
		expect(editor.locale.uiLanguage).toBe("de");
	});

	it("registers expected toolbar component factories", async () => {
		editor = await ClassicEditor.create(createElement());

		expect(editor.ui.componentFactory.has("math")).toBe(true);
		expect(editor.ui.componentFactory.has("insertTable")).toBe(true);
		expect(editor.ui.componentFactory.has("insertImage")).toBe(true);
		expect(editor.ui.componentFactory.has("specialCharacters")).toBe(true);
	});
});
