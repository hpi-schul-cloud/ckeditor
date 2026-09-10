import { ButtonView, Plugin } from "ckeditor5";

import { FileBrowserEditing } from "./filebrowserediting";
import audioIcon from "./theme/icons/audio.svg?raw";
import imageIcon from "./theme/icons/image.svg?raw";
import videoIcon from "./theme/icons/video.svg?raw";

export class FileBrowserUI extends Plugin {
	static get requires() {
		return [FileBrowserEditing] as const;
	}

	static get pluginName() {
		return "FileBrowserUI" as const;
	}

	init(): void {
		const { editor } = this;
		editor.ui.componentFactory.add("imagebrowser", (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: editor.t("Insert Image"),
				icon: imageIcon,
				tooltip: true,
			});

			const command = editor.commands.get("imagebrowser")!;
			view.bind("isEnabled").to(command, "isEnabled");
			this.listenTo(view, "execute", () => editor.execute("imagebrowser"));

			return view;
		});

		editor.ui.componentFactory.add("videobrowser", (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: editor.t("Insert Video"),
				icon: videoIcon,
				tooltip: true,
			});

			const command = editor.commands.get("videobrowser")!;
			view.bind("isEnabled").to(command, "isEnabled");
			this.listenTo(view, "execute", () => editor.execute("videobrowser"));

			return view;
		});

		editor.ui.componentFactory.add("audiobrowser", (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: editor.t("Insert Audio"),
				icon: audioIcon,
				tooltip: true,
			});

			const command = editor.commands.get("audiobrowser")!;
			view.bind("isEnabled").to(command, "isEnabled");
			this.listenTo(view, "execute", () => editor.execute("audiobrowser"));

			return view;
		});
	}
}
