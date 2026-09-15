import { Plugin, toWidget, viewToModelPositionOutsideModelElement, Widget } from "ckeditor5";
import type { ModelItem, ViewDowncastWriter, ViewUIElement } from "ckeditor5";

import { MathCommand } from "./mathcommand";
import { addDelimiters, extractDelimiters, renderEquation, MODEL_DISPLAY, MODEL_INLINE } from "./utils";

function createEditingView(modelItem: ModelItem, writer: ViewDowncastWriter) {
	const equation = String(modelItem.getAttribute("equation"));
	const display = !!modelItem.getAttribute("display");

	const container = writer.createContainerElement(display ? "div" : "span", {
		class: `ck-math-tex ${display ? "ck-math-tex-display" : "ck-math-tex-inline"}`,
		style: display ? "user-select: none;" : "user-select: none; display: inline-block;",
	});

	const uiElement = writer.createUIElement("div", null, function render(this: ViewUIElement, domDocument: Document) {
		const domElement = this.toDomElement(domDocument);
		renderEquation(equation, domElement, display);
		return domElement;
	});

	writer.insert(writer.createPositionAt(container, 0), uiElement);

	return container;
}

function createDataView(modelItem: ModelItem, { writer }: { writer: ViewDowncastWriter }) {
	const equation = String(modelItem.getAttribute("equation"));
	const display = !!modelItem.getAttribute("display");

	const container = writer.createContainerElement("span", { class: "math-tex" });
	writer.insert(writer.createPositionAt(container, 0), writer.createText(addDelimiters(equation, display)));

	return container;
}

export class MathEditing extends Plugin {
	static get requires() {
		return [Widget] as const;
	}

	static get pluginName() {
		return "MathEditing" as const;
	}

	init() {
		const { editor } = this;

		editor.commands.add("math", new MathCommand(editor));

		this.defineSchema();
		this.defineConverters();

		editor.editing.mapper.on(
			"viewToModelPosition",
			viewToModelPositionOutsideModelElement(editor.model, (viewElement) => viewElement.hasClass("ck-math-tex"))
		);
	}

	defineSchema() {
		const { schema } = this.editor.model;

		schema.register(MODEL_INLINE, {
			allowWhere: "$text",
			isInline: true,
			isObject: true,
			allowAttributes: ["equation", "display"],
		});

		schema.register(MODEL_DISPLAY, {
			allowWhere: "$block",
			isInline: false,
			isObject: true,
			allowAttributes: ["equation", "display"],
		});
	}

	defineConverters() {
		const { conversion } = this.editor;

		conversion.for("upcast").elementToElement({
			view: { name: "span", classes: ["math-tex"] },
			model: (viewElement, { writer }) => {
				const child = viewElement.getChild(0);

				if (!child || !child.is("$text")) {
					console.warn("[math] Skipped a .math-tex element without a text child.");
					return null;
				}

				const { equation, display } = extractDelimiters(child.data);

				return writer.createElement(display ? MODEL_DISPLAY : MODEL_INLINE, { equation, display });
			},
		});

		// Formulas authored between 2020-06-22 and 2020-07-14 were stored as
		// <script type="math/tex">. KaTeX auto-render ignores script tags, so they
		// were never visible to students; they are dropped rather than migrated.
		conversion.for("upcast").elementToElement({
			view: { name: "script", attributes: { type: /^math\/tex/ } },
			model: (viewElement) => {
				const child = viewElement.getChild(0);
				console.warn(
					'[math] Dropping unsupported legacy <script type="math/tex"> formula:',
					child && child.is("$text") ? child.data : "(empty)"
				);
				return null;
			},
		});

		conversion
			.for("editingDowncast")
			.elementToElement({
				model: MODEL_INLINE,
				view: (modelItem, { writer }) => toWidget(createEditingView(modelItem, writer), writer),
			})
			.elementToElement({
				model: MODEL_DISPLAY,
				view: (modelItem, { writer }) => toWidget(createEditingView(modelItem, writer), writer),
			});

		conversion
			.for("dataDowncast")
			.elementToElement({ model: MODEL_INLINE, view: createDataView })
			.elementToElement({ model: MODEL_DISPLAY, view: createDataView });
	}
}
