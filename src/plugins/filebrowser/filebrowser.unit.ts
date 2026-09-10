import { ClassicEditor, Essentials, Image, Paragraph } from "ckeditor5";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FileBrowser } from "./filebrowser";
import type { FileBrowserAdapter } from "./filebrowseradapter";

const createAdapter = (): FileBrowserAdapter => ({
	pickImage: vi.fn(),
	pickVideo: vi.fn(),
	pickAudio: vi.fn(),
});

describe("FileBrowser plugin", () => {
	let editor: ClassicEditor;

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

	async function createEditor(adapter?: FileBrowserAdapter): Promise<ClassicEditor> {
		const element = document.createElement("div");
		document.body.appendChild(element);

		return ClassicEditor.create({
			attachTo: element,
			plugins: [Essentials, Paragraph, Image, FileBrowser],
			toolbar: ["imagebrowser", "videobrowser", "audiobrowser"],
			licenseKey: "GPL",
			filebrowser: adapter ? { adapter } : undefined,
		});
	}

	describe("UI", () => {
		it("registers component factories for image, video, and audio browsers", async () => {
			editor = await createEditor(createAdapter());

			expect(editor.ui.componentFactory.has("imagebrowser")).toBe(true);
			expect(editor.ui.componentFactory.has("videobrowser")).toBe(true);
			expect(editor.ui.componentFactory.has("audiobrowser")).toBe(true);
		});

		it("creates button views for each browser", async () => {
			editor = await createEditor(createAdapter());

			const imageButton = editor.ui.componentFactory.create("imagebrowser");
			const videoButton = editor.ui.componentFactory.create("videobrowser");
			const audioButton = editor.ui.componentFactory.create("audiobrowser");

			imageButton.render();
			videoButton.render();
			audioButton.render();

			expect(imageButton.element?.tagName.toLowerCase()).toBe("button");
			expect(videoButton.element?.tagName.toLowerCase()).toBe("button");
			expect(audioButton.element?.tagName.toLowerCase()).toBe("button");
		});

		it("disables buttons when no adapter is configured", async () => {
			editor = await createEditor();

			expect(editor.commands.get("imagebrowser")!.isEnabled).toBe(false);
			expect(editor.commands.get("videobrowser")!.isEnabled).toBe(false);
			expect(editor.commands.get("audiobrowser")!.isEnabled).toBe(false);
		});

		it("enables buttons when an adapter is configured", async () => {
			editor = await createEditor(createAdapter());

			expect(editor.commands.get("imagebrowser")!.isEnabled).toBe(true);
			expect(editor.commands.get("videobrowser")!.isEnabled).toBe(true);
			expect(editor.commands.get("audiobrowser")!.isEnabled).toBe(true);
		});
	});

	describe("commands", () => {
		it("inserts an imageBlock element when the image adapter resolves a selection", async () => {
			const adapter = createAdapter();
			(adapter.pickImage as ReturnType<typeof vi.fn>).mockResolvedValue({
				url: "https://example.com/image.png",
				alt: "Example image",
			});

			editor = await createEditor(adapter);

			await editor.execute("imagebrowser");

			expect(adapter.pickImage).toHaveBeenCalled();
			const data = editor.getData();
			expect(data).toContain("https://example.com/image.png");
			expect(data).toContain('alt="Example image"');
		});

		it("inserts a video element when the video adapter resolves a selection", async () => {
			const adapter = createAdapter();
			(adapter.pickVideo as ReturnType<typeof vi.fn>).mockResolvedValue({
				url: "https://example.com/video.mp4",
			});

			editor = await createEditor(adapter);

			await editor.execute("videobrowser");

			expect(adapter.pickVideo).toHaveBeenCalled();
			const data = editor.getData();
			expect(data).toContain("https://example.com/video.mp4");
			expect(data).toContain("<video");
			expect(data).toContain("controls");
		});

		it("inserts an audio element when the audio adapter resolves a selection", async () => {
			const adapter = createAdapter();
			(adapter.pickAudio as ReturnType<typeof vi.fn>).mockResolvedValue({
				url: "https://example.com/audio.mp3",
			});

			editor = await createEditor(adapter);

			await editor.execute("audiobrowser");

			expect(adapter.pickAudio).toHaveBeenCalled();
			const data = editor.getData();
			expect(data).toContain("https://example.com/audio.mp3");
			expect(data).toContain("<audio");
			expect(data).toContain("controls");
		});

		it("does not insert anything when the user cancels the image picker", async () => {
			const adapter = createAdapter();
			(adapter.pickImage as ReturnType<typeof vi.fn>).mockResolvedValue(null);

			editor = await createEditor(adapter);
			editor.setData("<p>before</p>");

			await editor.execute("imagebrowser");

			expect(adapter.pickImage).toHaveBeenCalled();
			expect(editor.getData()).toBe("<p>before</p>");
		});
	});

	describe("schema and converters", () => {
		it("round-trips a video element", async () => {
			editor = await createEditor();
			const html = '<video src="https://example.com/video.mp4" controls controlslist="nodownload"></video>';

			editor.setData(html);

			expect(editor.getData()).toContain("https://example.com/video.mp4");
			expect(editor.getData()).toContain("<video");
		});

		it("round-trips an audio element", async () => {
			editor = await createEditor();
			const html = '<audio src="https://example.com/audio.mp3" controls controlslist="nodownload"></audio>';

			editor.setData(html);

			expect(editor.getData()).toContain("https://example.com/audio.mp3");
			expect(editor.getData()).toContain("<audio");
		});
	});
});
