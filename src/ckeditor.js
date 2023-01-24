import InlineEditor from "@ckeditor/ckeditor5-editor-inline/src/inlineeditor.js";
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight.js";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Mathematics from 'ckeditor5-math/src/math';
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

import "./custom.css";
import "./content-styles.css";

class Editor extends InlineEditor {}

Editor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	Code,
	Essentials,
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
		engine: 'katex',
		outputType: 'span',
		forceOutputType: true,
		enablePreview: true,
	},
};

export default Editor;
