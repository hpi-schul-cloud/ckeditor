import Command from "@ckeditor/ckeditor5-core/src/command.js";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin.js";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview.js";
import videoIcon from "./video.svg";

class InsertVideoCommand extends Command {
	execute(options = {}) {
		const source = options.source;
		if (typeof source !== "string" || !source) return;

		const model = this.editor.model;
		model.change((writer) => {
			const video = writer.createElement("video", {
				source,
				controls: true,
				controlslist: "nodownload",
			});
			model.insertContent(video, model.document.selection);
			writer.setSelection(video, "on");
		});
	}
}

export default class TaskVideoUpload extends Plugin {
	static get pluginName() {
		return "TaskVideoUpload";
	}

	init() {
		const uploadVideo = this.editor.config.get("taskVideoUpload");
		if (typeof uploadVideo !== "function") return;

		const { schema } = this.editor.model;
		const { conversion } = this.editor;
		schema.register("video", {
			allowWhere: "$block",
			isBlock: true,
			isObject: true,
			isLimit: true,
			allowAttributes: ["source", "controls", "controlslist"],
		});

		conversion.elementToElement({ model: "video", view: "video" });
		conversion.attributeToAttribute({ model: "source", view: "src" });
		conversion.attributeToAttribute({ model: "controls", view: "controls" });
		conversion.attributeToAttribute({ model: "controlslist", view: "controlslist" });

		this.editor.commands.add("insertVideo", new InsertVideoCommand(this.editor));
		this.editor.ui.componentFactory.add("taskVideoUpload", (locale) => {
			const button = new ButtonView(locale);
			button.set({
				label: "Insert video",
				icon: videoIcon,
				tooltip: true,
			});
			button.on("execute", () => void uploadVideo());

			return button;
		});
	}
}
