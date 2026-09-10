import {
	Autoformat,
	Bold,
	ClassicEditor as ClassicEditorBase,
	Essentials,
	FontBackgroundColor,
	FontColor,
	Heading,
	HorizontalLine,
	Image,
	ImageInsertViaUrl,
	InlineEditor as InlineEditorBase,
	Italic,
	Link,
	List,
	Paragraph,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableToolbar,
	WordCount,
	type PluginConstructor,
} from "ckeditor5";

import type { Editor as CkEditor, EditorConfig as CkEditorConfig } from "ckeditor5";

import { Math } from "./plugins/math/math";
import { mathTranslations } from "./plugins/math/translations";

import "ckeditor5/ckeditor5.css";

import translationsDe from "ckeditor5/translations/de.js";
import translationsEs from "ckeditor5/translations/es.js";
import translationsUk from "ckeditor5/translations/uk.js";

class ClassicEditor extends ClassicEditorBase {
	static override create(
		sourceElementOrConfig: HTMLElement | string | CkEditorConfig,
		config?: CkEditorConfig
	): Promise<ClassicEditor> {
		if (typeof HTMLElement !== "undefined" && sourceElementOrConfig instanceof HTMLElement) {
			return super.create({ attachTo: sourceElementOrConfig, ...(config ?? {}) });
		}

		if (typeof sourceElementOrConfig === "string") {
			return super.create({ root: { initialData: sourceElementOrConfig }, ...(config ?? {}) });
		}

		return super.create(sourceElementOrConfig as CkEditorConfig);
	}
}

class InlineEditor extends InlineEditorBase {
	static override create(
		sourceElementOrConfig: HTMLElement | string | CkEditorConfig,
		config?: CkEditorConfig
	): Promise<InlineEditor> {
		if (typeof HTMLElement !== "undefined" && sourceElementOrConfig instanceof HTMLElement) {
			return super.create({ root: { element: sourceElementOrConfig }, ...(config ?? {}) });
		}

		if (typeof sourceElementOrConfig === "string") {
			return super.create({ root: { initialData: sourceElementOrConfig }, ...(config ?? {}) });
		}

		return super.create(sourceElementOrConfig as CkEditorConfig);
	}
}

const plugins: PluginConstructor[] = [
	Autoformat,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	Heading,
	HorizontalLine,
	Image,
	ImageInsertViaUrl,
	Italic,
	Link,
	List,
	Math,
	Paragraph,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableToolbar,
	WordCount,
];

// "en" is the built-in fallback and needs no translation file
const translations = [translationsDe, translationsEs, translationsUk, ...mathTranslations];

const config: CkEditorConfig = {
	language: "de",
	translations,
	licenseKey: "GPL",
	toolbar: {
		items: [
			"undo",
			"redo",
			"|",
			"heading",
			"|",
			"bold",
			"italic",
			"fontColor",
			"fontBackgroundColor",
			"strikethrough",
			"superscript",
			"subscript",
			"|",
			"link",
			"insertImage",
			"bulletedList",
			"numberedList",
			"math",
			"horizontalLine",
			"|",
			"insertTable",
			"specialCharacters",
			"removeFormat",
		],
	},
	table: {
		contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
	},
};

ClassicEditor.builtinPlugins = plugins;
InlineEditor.builtinPlugins = plugins;

ClassicEditor.defaultConfig = config;
InlineEditor.defaultConfig = config;

export { ClassicEditor, InlineEditor };
export type Editor = CkEditor;
export type EditorConfig = CkEditorConfig;
