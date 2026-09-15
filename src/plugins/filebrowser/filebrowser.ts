import { Plugin } from "ckeditor5";

import "./filebrowserconfig";
import { FileBrowserEditing } from "./filebrowserediting";
import { FileBrowserUI } from "./filebrowserui";

export class FileBrowser extends Plugin {
	static get requires() {
		return [FileBrowserEditing, FileBrowserUI] as const;
	}

	static get pluginName() {
		return "FileBrowser" as const;
	}
}
