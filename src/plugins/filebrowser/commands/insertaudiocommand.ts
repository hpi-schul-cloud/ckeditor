import { Command } from "ckeditor5";
import type { Editor } from "ckeditor5";

import type { FileBrowserAdapter, FileBrowserSelection } from "../filebrowseradapter";

export class InsertAudioCommand extends Command {
	private readonly adapter?: FileBrowserAdapter;

	constructor(editor: Editor, adapter?: FileBrowserAdapter) {
		super(editor);
		this.adapter = adapter;
	}

	public override refresh(): void {
		this.isEnabled = !!this.adapter;
	}

	public override async execute(): Promise<void> {
		if (!this.adapter) {
			return;
		}

		const selection = await this.adapter.pickAudio();

		if (!selection) {
			return;
		}

		const { url } = selection as FileBrowserSelection;

		this.editor.model.change((writer) => {
			const audioElement = writer.createElement("audio", {
				source: url,
				controls: "true",
				controlslist: "nodownload",
			});
			this.editor.model.insertContent(audioElement, this.editor.model.document.selection);
		});
	}
}
