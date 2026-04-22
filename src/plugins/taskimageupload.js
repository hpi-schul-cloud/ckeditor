import Plugin from "@ckeditor/ckeditor5-core/src/plugin.js";
import imageIcon from "@ckeditor/ckeditor5-core/theme/icons/image.svg";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview.js";

export default class TaskImageUpload extends Plugin {
	static get pluginName() {
		return "TaskImageUpload";
	}

	init() {
		const uploadImage = this.editor.config.get("taskImageUpload");
		if (typeof uploadImage !== "function") return;

		this.editor.ui.componentFactory.add("taskImageUpload", (locale) => {
			const button = new ButtonView(locale);
			button.set({
				label: "Insert image",
				icon: imageIcon,
				tooltip: true,
			});
			button.on("execute", () => void uploadImage());

			return button;
		});
	}
}
