import Command from "@ckeditor/ckeditor5-core/src/command.js";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin.js";
import mediaIcon from "@ckeditor/ckeditor5-media-embed/theme/icons/media.svg";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview.js";

class InsertAudioCommand extends Command {
	execute(options = {}) {
		const source = options.source;
		if (typeof source !== "string" || !source) return;

		const model = this.editor.model;
		model.change((writer) => {
			const audio = writer.createElement("audio", {
				source,
				controls: true,
			});
			model.insertContent(audio, model.document.selection);
			writer.setSelection(audio, "on");
		});
	}
}

export default class TaskAudioUpload extends Plugin {
	static get pluginName() {
		return "TaskAudioUpload";
	}

	init() {
		const uploadAudio = this.editor.config.get("taskAudioUpload");
		if (typeof uploadAudio !== "function") return;

		const { schema } = this.editor.model;
		const { conversion } = this.editor;
		schema.register("audio", {
			allowWhere: "$block",
			isBlock: true,
			isObject: true,
			isLimit: true,
			allowAttributes: ["source", "controls"],
		});

		conversion.elementToElement({ model: "audio", view: "audio" });
		conversion.attributeToAttribute({ model: "source", view: "src" });
		conversion.attributeToAttribute({ model: "controls", view: "controls" });

		this.editor.commands.add("insertAudio", new InsertAudioCommand(this.editor));
		this.editor.ui.componentFactory.add("taskAudioUpload", (locale) => {
			const button = new ButtonView(locale);
			button.set({
				label: "Insert audio",
				icon: mediaIcon,
				tooltip: true,
			});
			button.on("execute", () => void uploadAudio());

			return button;
		});
	}
}
