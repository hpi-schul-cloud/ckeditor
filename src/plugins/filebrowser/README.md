# FileBrowser plugin

Adds `imagebrowser`, `videobrowser`, and `audiobrowser` toolbar buttons that let the consumer pick media through their own UI/backend, instead of CKEditor's built-in image upload flow. Follows the same "adapter" pattern CKEditor5 itself uses for `UploadAdapter` (see `@ckeditor/ckeditor5-upload`): the plugin defines _what_ it needs, the consumer supplies _how_ it happens.

## Files

- [filebrowseradapter.ts](./filebrowseradapter.ts) — the `FileBrowserAdapter` contract consumers implement.
- [filebrowserediting.ts](./filebrowserediting.ts) — schema, converters, and commands (reads `config.filebrowser.adapter`).
- [filebrowserui.ts](./filebrowserui.ts) — the three toolbar buttons.
- [commands/](./commands/) — `InsertImageCommand`, `InsertVideoCommand`, `InsertAudioCommand`, each calling the matching `pick*` adapter method.

## Implementing an adapter

Implement `FileBrowserAdapter` and pass it as `config.filebrowser.adapter` when creating the editor:

```ts
import type { FileBrowserAdapter } from "@hpi-schul-cloud/ckeditor/legacy";

const adapter: FileBrowserAdapter = {
	async pickImage() {
		// open your own file picker / upload dialog here
		const file = await myOwnFilePicker({ accept: "image" });
		if (!file) return null; // user cancelled -> command stays a no-op

		return { url: file.url, alt: file.description };
	},
	async pickVideo() {
		const file = await myOwnFilePicker({ accept: "video" });
		return file ? { url: file.url } : null;
	},
	async pickAudio() {
		const file = await myOwnFilePicker({ accept: "audio" });
		return file ? { url: file.url } : null;
	},
};

LegacyClassicEditor.create(element, { filebrowser: { adapter } });
```

Each `pick*` method must resolve with `{ url }` (`pickImage` may also include `alt`), or `null` if the user cancelled. Rejecting the promise is not handled specially, so catch your own errors before resolving.

If no adapter is configured, the three buttons are registered but stay disabled — see how `InsertImageCommand` derives `isEnabled` from `!!this.adapter` in [commands/insertimagecommand.ts](./commands/insertimagecommand.ts).
