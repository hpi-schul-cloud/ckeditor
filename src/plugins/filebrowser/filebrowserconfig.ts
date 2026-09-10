import type { FileBrowserAdapter } from "./filebrowseradapter";

declare module "ckeditor5" {
	interface EditorConfig {
		filebrowser?: {
			adapter?: FileBrowserAdapter;
		};
	}
}
