import { Plugin } from "ckeditor5";

import type { FileBrowserAdapter } from "./filebrowseradapter";
import "./filebrowserconfig";
import { InsertAudioCommand } from "./commands/insertaudiocommand";
import { InsertImageCommand } from "./commands/insertimagecommand";
import { InsertVideoCommand } from "./commands/insertvideocommand";

const VIDEO_ATTRIBUTES = ["source", "controls", "controlslist"];
const AUDIO_ATTRIBUTES = ["source", "controls", "controlslist"];

export class FileBrowserEditing extends Plugin {
	static get pluginName() {
		return "FileBrowserEditing" as const;
	}

	init(): void {
		const adapter = this.editor.config.get("filebrowser.adapter") as FileBrowserAdapter | undefined;

		if (!adapter) {
			// eslint-disable-next-line no-console
			console.warn("[FileBrowser] No adapter configured. File browser buttons will be disabled.");
		}

		this.editor.commands.add("imagebrowser", new InsertImageCommand(this.editor, adapter));
		this.editor.commands.add("videobrowser", new InsertVideoCommand(this.editor, adapter));
		this.editor.commands.add("audiobrowser", new InsertAudioCommand(this.editor, adapter));

		this.defineSchema();
		this.defineConverters();
	}

	private defineSchema(): void {
		const { schema } = this.editor.model;

		schema.register("video", {
			allowWhere: "$block",
			isBlock: true,
			isObject: true,
			isLimit: true,
			allowAttributes: VIDEO_ATTRIBUTES,
		});

		schema.register("audio", {
			allowWhere: "$block",
			isBlock: true,
			isObject: true,
			isLimit: true,
			allowAttributes: AUDIO_ATTRIBUTES,
		});
	}

	private defineConverters(): void {
		const { conversion } = this.editor;

		// Video model <-> view
		conversion.for("upcast").elementToElement({
			view: "video",
			model: "video",
		});
		conversion.for("downcast").elementToElement({
			model: "video",
			view: "video",
		});

		// Audio model <-> view
		conversion.for("upcast").elementToElement({
			view: "audio",
			model: "audio",
		});
		conversion.for("downcast").elementToElement({
			model: "audio",
			view: "audio",
		});

		// Shared attributes
		conversion.for("upcast").attributeToAttribute({
			view: "src",
			model: "source",
		});
		conversion.for("downcast").attributeToAttribute({
			model: "source",
			view: "src",
		});

		conversion.for("upcast").attributeToAttribute({
			view: "controls",
			model: "controls",
		});
		conversion.for("downcast").attributeToAttribute({
			model: "controls",
			view: "controls",
		});

		conversion.for("upcast").attributeToAttribute({
			view: "controlslist",
			model: "controlslist",
		});
		conversion.for("downcast").attributeToAttribute({
			model: "controlslist",
			view: "controlslist",
		});
	}
}
