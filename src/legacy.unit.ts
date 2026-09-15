import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LegacyClassicEditor } from "./legacy";

describe("Legacy editor bundle", () => {
	let editor: LegacyClassicEditor;

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

	it("creates a LegacyClassicEditor with default config", async () => {
		editor = await LegacyClassicEditor.create(createElement());

		expect(editor).toBeTruthy();
		expect(editor.locale.uiLanguage).toBe("de");
	});

	describe("when an adapter is configured", () => {
		it("enables file browser buttons", async () => {
			const adapter = {
				pickImage: vi.fn(),
				pickVideo: vi.fn(),
				pickAudio: vi.fn(),
			};

			editor = await LegacyClassicEditor.create(createElement(), {
				filebrowser: { adapter },
			});

			expect(editor.commands.get("imagebrowser")!.isEnabled).toBe(true);
			expect(editor.commands.get("videobrowser")!.isEnabled).toBe(true);
			expect(editor.commands.get("audiobrowser")!.isEnabled).toBe(true);
		});
	});

	it("registers expected toolbar component factories", async () => {
		editor = await LegacyClassicEditor.create(createElement());

		expect(editor.ui.componentFactory.has("helplink")).toBe(true);
		expect(editor.ui.componentFactory.has("math")).toBe(true);
		expect(editor.ui.componentFactory.has("imagebrowser")).toBe(true);
		expect(editor.ui.componentFactory.has("mediaEmbed")).toBe(true);
		expect(editor.ui.componentFactory.has("insertTable")).toBe(true);
	});
});
