import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript.js";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript.js";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";


class Editor extends ClassicEditor {}

Editor.builtinPlugins = [
     BlockQuote,
     Bold,
     Code,
     Essentials,
     Heading,
     Italic,
     Link,
     List,
     Paragraph,
     Subscript,
     Superscript,
     Underline,
];


Editor.defaultConfig = {
     toolbar: {
         items: [
             "undo",
             "redo",
             "heading",
             "|",
             "bold",
             "italic",
             "underline",
             "blockQuote",
             "code",
             "superscript",
             "subscript",
             "|",
             "link",
             "bulletedList",
             "numberedList",
         ],
     },
     language: "de",
};

export default Editor;