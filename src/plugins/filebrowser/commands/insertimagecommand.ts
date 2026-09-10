import { Command } from "ckeditor5";
import type { Editor } from "ckeditor5";

import type { FileBrowserAdapter, ImageFileBrowserSelection } from "../filebrowseradapter";

export class InsertImageCommand extends Command {
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

		const selection = await this.adapter.pickImage();

		if (!selection) {
			return;
		}

		const { url, alt = "" } = selection as ImageFileBrowserSelection;

		this.editor.model.change((writer) => {
			const imageElement = writer.createElement("imageBlock", {
				src: url,
				alt,
			});
			this.editor.model.insertContent(imageElement, this.editor.model.document.selection);
		});
	}
}
