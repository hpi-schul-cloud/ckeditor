import { Plugin } from "ckeditor5";

import { MathEditing } from "./mathediting";
import { MathUI } from "./mathui";

export class Math extends Plugin {
	static get requires() {
		return [MathEditing, MathUI] as const;
	}

	static get pluginName() {
		return "Math" as const;
	}
}
