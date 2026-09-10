# CKEditor

Custom version of CKEditor 5 for the Schulcloud-Verbund-Software-Client.

Built with [CKEditor 5 v48.3.0](https://github.com/ckeditor/ckeditor5/releases/tag/v48.3.0), bundled with Vite and written in TypeScript.

## Package exports

| Entry   | Import                             | Stylesheet               | Consumers         |
| ------- | ---------------------------------- | ------------------------ | ----------------- |
| Default | `@hpi-schul-cloud/ckeditor`        | `build/style.css`        | nuxt-client       |
| Legacy  | `@hpi-schul-cloud/ckeditor/legacy` | `build/style-legacy.css` | schulcloud-client |

Both entries are fully self-contained bundles. **Do not load `build/index.js` and `build/legacy.js` on the same page**, because CKEditor 5 detects duplicated core modules and throws a runtime error.

## Install

```sh
npm i @hpi-schul-cloud/ckeditor
```

In production the editors are usually instantiated through the consumer's UI wrapper (for example a Vue component in nuxt-client). The minimal API looks like:

```js
import { ClassicEditor } from "@hpi-schul-cloud/ckeditor";
import "@hpi-schul-cloud/ckeditor/build/style.css";

ClassicEditor.create(element, config);
```

Each editor class ships with `builtinPlugins` and a `defaultConfig`. Consumers can override any config key per instance, including `config.plugins`.

## Built-in plugins

### Default editor (`ClassicEditor` / `InlineEditor`)

Both editors share the same plugin set:

- Autoformat
- Bold
- Essentials
- FontBackgroundColor
- FontColor
- Heading
- HorizontalLine
- Image
- ImageInsertViaUrl
- Italic
- Link
- List
- Math (custom KaTeX-backed plugin)
- Paragraph
- RemoveFormat
- SpecialCharacters
- SpecialCharactersEssentials
- Strikethrough
- Subscript
- Superscript
- Table
- TableToolbar
- WordCount

### Legacy editor (`LegacyClassicEditor`)

Includes all default plugins plus:

- BlockQuote
- Code
- FileBrowser (custom image/video/audio file browser plugin)
- Font (adds FontSize and FontFamily)
- HelpLink (custom toolbar button that opens a configurable help URL)
- ImageResize
- ImageToolbar
- Indent
- MediaEmbed
- PasteFromOffice
- TableCellProperties
- TableProperties
- Underline

## Consumer configuration

### Math (all editors)

KaTeX is **not** bundled. The consuming application must provide the engine and its styles:

```js
import katex from "katex";
import "katex/dist/katex.min.css";

window.katex = katex;
```

### FileBrowser (legacy only)

Adds three toolbar buttons: `imagebrowser`, `videobrowser`, and `audiobrowser`. The consumer must provide a `filebrowser.adapter`:

```js
LegacyClassicEditor.create(element, {
	filebrowser: {
		adapter: {
			async pickImage() {
				return { url: "https://example.com/image.png", alt: "Description" };
			},
			async pickVideo() {
				return { url: "https://example.com/video.mp4" };
			},
			async pickAudio() {
				return { url: "https://example.com/audio.mp3" };
			},
		},
	},
});
```

If no adapter is configured, the buttons are registered but disabled.

### HelpLink (legacy only)

Opens a configurable help URL in a new tab:

```js
LegacyClassicEditor.create(element, {
	helplink: {
		url: "/help/confluence/123409350",
	},
});
```

## Supported languages

- de (default)
- en
- es
- uk

Select one per instance with `config.language`.

## Development

```sh
npm install
npm run build       # bundle to build/
npm run dev         # rebuild on change
npm run type-check  # tsc --noEmit
npm run test        # run unit tests once
npm run test:watch  # run unit tests in watch mode
npm run sample      # dev server for sample/index.html
```

The sample pages are split because the default and legacy bundles cannot be loaded together:

- `sample/index.html` — overview with links.
- `sample/default.html` — default editors for nuxt-client.
- `sample/legacy.html` — legacy editor for schulcloud-client.
