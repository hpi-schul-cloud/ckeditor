import {
	Autoformat,
	BlockQuote,
	Bold,
	ClassicEditor as ClassicEditorBase,
	Code,
	Essentials,
	Font,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	HorizontalLine,
	Image,
	ImageResize,
	ImageToolbar,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCellProperties,
	TableProperties,
	TableToolbar,
	Underline,
	type PluginConstructor,
} from "ckeditor5";

import type { Editor as CkEditor, EditorConfig as CkEditorConfig } from "ckeditor5";

import { FileBrowser } from "./plugins/filebrowser/filebrowser";
import { fileBrowserTranslations } from "./plugins/filebrowser/translations";
import { HelpLink } from "./plugins/helplink/helplink";
import { helpLinkTranslations } from "./plugins/helplink/translations";
import { Math } from "./plugins/math/math";
import { mathTranslations } from "./plugins/math/translations";

import "ckeditor5/ckeditor5.css";

import translationsDe from "ckeditor5/translations/de.js";
import translationsEs from "ckeditor5/translations/es.js";
import translationsUk from "ckeditor5/translations/uk.js";

class LegacyClassicEditor extends ClassicEditorBase {
	static override create(
		sourceElementOrConfig: HTMLElement | string | CkEditorConfig,
		config?: CkEditorConfig
	): Promise<LegacyClassicEditor> {
		if (typeof HTMLElement !== "undefined" && sourceElementOrConfig instanceof HTMLElement) {
			return super.create({ attachTo: sourceElementOrConfig, ...(config ?? {}) });
		}

		if (typeof sourceElementOrConfig === "string") {
			return super.create({ root: { initialData: sourceElementOrConfig }, ...(config ?? {}) });
		}

		return super.create(sourceElementOrConfig as CkEditorConfig);
	}
}

// Material Design Colors: https://materialuicolors.co/
const fontColors = [
	{ color: "#F44336" },
	{ color: "#E91E63" },
	{ color: "#9C27B0" },
	{ color: "#673AB7" },
	{ color: "#3F51B5" },
	{ color: "#2196F3" },
	{ color: "#03A9F4" },
	{ color: "#00BCD4" },
	{ color: "#009688" },
	{ color: "#4CAF50" },
	{ color: "#8BC34A" },
	{ color: "#CDDC39" },
	{ color: "#FFEB3B" },
	{ color: "#FFC107" },
	{ color: "#FF9800" },
	{ color: "#FF5722" },
	{ color: "#795548" },
	{ color: "#9E9E9E" },
	{ color: "#607D8B" },
	{ color: "#000000" },
	{ color: "#FFFFFF" },
];

const plugins: PluginConstructor[] = [
	Autoformat,
	BlockQuote,
	Bold,
	Code,
	Essentials,
	FileBrowser,
	Font,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	HelpLink,
	HorizontalLine,
	Image,
	ImageResize,
	ImageToolbar,
	Indent,
	Italic,
	Link,
	List,
	Math,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCellProperties,
	TableProperties,
	TableToolbar,
	Underline,
];

// "en" is the built-in fallback and needs no translation file
const translations = [
	translationsDe,
	translationsEs,
	translationsUk,
	...mathTranslations,
	...helpLinkTranslations,
	...fileBrowserTranslations,
];

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
			"underline",
			"strikethrough",
			"subscript",
			"superscript",
			"fontColor",
			"fontBackgroundColor",
			"removeFormat",
			"|",
			"blockQuote",
			"code",
			"horizontalLine",
			"|",
			"numberedList",
			"bulletedList",
			"|",
			"specialCharacters",
			"math",
			"insertTable",
			"|",
			"link",
			"imagebrowser",
			"mediaEmbed",
			"videobrowser",
			"audiobrowser",
			"helplink",
			"|",
		],
	},
	helplink: {
		url: "/help/confluence/123409350",
	},
	fontColor: {
		colors: fontColors,
	},
	fontBackgroundColor: {
		colors: fontColors,
	},
	table: {
		contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"],
	},
	image: {
		toolbar: ["imageTextAlternative", "|", "imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight"],
	},
};

LegacyClassicEditor.builtinPlugins = plugins;
LegacyClassicEditor.defaultConfig = config;

export { LegacyClassicEditor };
export type Editor = CkEditor;
export type EditorConfig = CkEditorConfig;
