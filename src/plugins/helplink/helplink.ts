import { ButtonView, Plugin } from "ckeditor5";

import helpIcon from "./theme/icons/help.svg?raw";

const DEFAULT_HELP_URL = "/help/confluence/123409350";

declare module "ckeditor5" {
	interface EditorConfig {
		helplink?: {
			url?: string;
		};
	}
}

export class HelpLink extends Plugin {
	static get pluginName() {
		return "HelpLink" as const;
	}

	init(): void {
		const { editor } = this;
		const url = (editor.config.get("helplink.url") as string | undefined) ?? DEFAULT_HELP_URL;

		editor.ui.componentFactory.add("helplink", (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: editor.t("Open Help Page"),
				icon: helpIcon,
				tooltip: true,
			});

			this.listenTo(view, "execute", () => {
				window.open(url, "_blank");
			});

			return view;
		});
	}
}
