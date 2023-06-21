import BalloonEditor from "@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/font.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight.js";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js";
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
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount.js";
import addMissingTranslationsDe from "./locales/de";
import addMissingTranslationsEn from "./locales/en";
import addMissingTranslationsEs from "./locales/es";
import addMissingTranslationsUk from "./locales/uk";

import "./variables.css";
import "./content-styles.css";
import "./custom-content-styles.css";

class Editor extends BalloonEditor {}

Editor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	Code,
	Essentials,
	FontBackgroundColor,
	Heading,
	Highlight,
	HorizontalLine,
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
	Underline,
	WordCount,
];

Editor.defaultConfig = {
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
			"highlight",
			"fontBackgroundColor",
			"code",
			"superscript",
			"subscript",
			"|",
			"link",
			"bulletedList",
			"numberedList",
			"math",
			"horizontalLine",
			"|",
			"blockQuote",
			"insertTable",
			"specialCharacters",
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
};

addMissingTranslationsDe();
addMissingTranslationsEn();
addMissingTranslationsEs();
addMissingTranslationsUk();

export default Editor;
