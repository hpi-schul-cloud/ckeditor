import { Command } from "ckeditor5";
import type { ModelDocumentSelection, ModelElement } from "ckeditor5";

import { MODEL_DISPLAY, MODEL_INLINE } from "./utils";

export type MathValue = { equation: string; display: boolean } | null;

function getSelectedMathWidget(selection: ModelDocumentSelection) {
	const selectedElement = selection.getSelectedElement();

	return selectedElement?.is("element", MODEL_INLINE) || selectedElement?.is("element", MODEL_DISPLAY)
		? (selectedElement as ModelElement)
		: null;
}

export class MathCommand extends Command {
	declare public value: MathValue;

	public override refresh(): void {
		const { model } = this.editor;
		const { selection } = model.document;
		const selectedElement = getSelectedMathWidget(selection);

		this.value = selectedElement
			? {
					equation: String(selectedElement.getAttribute("equation")),
					display: !!selectedElement.getAttribute("display"),
				}
			: null;

		this.isEnabled =
			!!selectedElement || model.schema.checkChild(selection.getFirstPosition()!.parent as ModelElement, MODEL_INLINE);
	}

	public override execute(equation: string, display: boolean): void {
		const { model } = this.editor;
		const selectedElement = getSelectedMathWidget(model.document.selection);

		model.change((writer) => {
			const element = writer.createElement(display ? MODEL_DISPLAY : MODEL_INLINE, {
				equation,
				display,
			});

			if (selectedElement) {
				model.insertContent(element, writer.createSelection(selectedElement, "on"));
			} else {
				model.insertContent(element);
			}

			writer.setSelection(element, "on");
		});
	}
}
