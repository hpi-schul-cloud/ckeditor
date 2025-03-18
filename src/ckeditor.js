import { BalloonEditor as BalloonEditorBase } from "@ckeditor/ckeditor5-editor-balloon";
import { ClassicEditor as ClassicEditorBase } from "@ckeditor/ckeditor5-editor-classic";
import { InlineEditor as InlineEditorBase } from "@ckeditor/ckeditor5-editor-inline";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import { Clipboard } from "@ckeditor/ckeditor5-clipboard";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js";
import { Image } from "@ckeditor/ckeditor5-image";
import ImageInsertViaUrl from "@ckeditor/ckeditor5-image/src/imageinsertviaurl.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Mathematics from "@isaul32/ckeditor5-math/src/math";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters.js";
import SpecialCharactersEssentials from "@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough.js";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript.js";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist.js";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount.js";
import addMissingTranslationsDe from "./locales/de";
import addMissingTranslationsEn from "./locales/en";
import addMissingTranslationsEs from "./locales/es";
import addMissingTranslationsUk from "./locales/uk";

import "./variables.css";
import "./content-styles.css";
import "./custom-content-styles.css";

class BalloonEditor extends BalloonEditorBase {}
class ClassicEditor extends ClassicEditorBase {}
class InlineEditor extends InlineEditorBase {}

const plugins = [
	Autoformat,
	Bold,
	Clipboard,
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
	Mathematics,
	Paragraph,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableToolbar,
	TodoList,
	WordCount,
];

const config = {
	toolbar: {
		items: [
			"undo",
			"redo",
			"|",
			"heading",
			"|",
			"bold",
			"italic",
			"strikethrough",
			"fontColor",
			"fontBackgroundColor",
			"superscript",
			"subscript",
			"|",
			"link",
			"insertImage",
			"bulletedList",
			"numberedList",
			"todoList",
			"math",
			"horizontalLine",
			"|",
			"insertTable",
			"specialCharacters",
			"clipboard",
			"removeFormat",
		],
	},
	language: "de",
	table: {
		contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
	},
	math: {
		engine: "katex",
		outputType: "span",
		forceOutputType: true,
		enablePreview: true,
	},
	fontColor: {
		colors: [
			{ color: "#827717", label: "Olive green" },
			{ color: "#388E3C", label: "Green" },
			{ color: "#00838F", label: "Cyan" },
			{ color: "#1976D2", label: "Blue" },
			{ color: "#3F51B5", label: "Indigo" },
			{ color: "#673AB7", label: "Deep Purple" },
			{ color: "#9C27B0", label: "Purple" },
			{ color: "#D81B60", label: "Pink" },
			{ color: "#D32F2F", label: "Red" },
		],
	},
	fontBackgroundColor: {
		colors: [
			{ color: "#DCEDC8", label: "Light green" },
			{ color: "#C8E6C9", label: "Green" },
			{ color: "#B2EBF2", label: "Cyan" },
			{ color: "#BBDEFB", label: "Blue" },
			{ color: "#C5CAE9", label: "Indigo" },
			{ color: "#E1BEE7", label: "Purple" },
			{ color: "#F8BBD0", label: "Pink" },
			{ color: "#FFCCBC", label: "Orange" },
			{ color: "#FFECB3", label: "Amber" },
		],
	},
};

BalloonEditor.builtinPlugins = plugins;
ClassicEditor.builtinPlugins = plugins;
InlineEditor.builtinPlugins = plugins;

BalloonEditor.defaultConfig = config;
ClassicEditor.defaultConfig = config;
InlineEditor.defaultConfig = config;

addMissingTranslationsDe();
addMissingTranslationsEn();
addMissingTranslationsEs();
addMissingTranslationsUk();

export default { BalloonEditor, ClassicEditor, InlineEditor };
