import {
	ButtonView,
	createLabeledInputText,
	IconCancel,
	IconCheck,
	LabeledFieldView,
	LabelView,
	submitHandler,
	SwitchButtonView,
	View,
} from "ckeditor5";
import type { Locale } from "ckeditor5";

import { renderEquation } from "../utils";

import "../theme/math.css";

export class MathFormView extends View {
	declare public displayMode: boolean;
	public equationInputView: LabeledFieldView;
	public displayButtonView: SwitchButtonView;
	public previewLabel: LabelView;
	public previewView: View;
	public saveButtonView: ButtonView;
	public cancelButtonView: ButtonView;
	public actionsView: View;
	private previewRenderElement: HTMLElement | null = null;

	constructor(locale: Locale) {
		super(locale);

		const { t } = locale;

		this.set("displayMode", false);

		this.equationInputView = new LabeledFieldView(locale, createLabeledInputText);
		this.equationInputView.label = t("TeX formula");

		this.displayButtonView = new SwitchButtonView(locale);
		this.displayButtonView.set({ label: t("Display mode"), withText: true });
		this.displayButtonView.bind("isOn").to(this, "displayMode");
		this.displayButtonView.on("execute", () => {
			this.displayMode = !this.displayMode;
		});

		this.previewView = new View(locale);
		this.previewView.setTemplate({
			tag: "div",
			attributes: { class: ["ck", "ck-math-preview"] },
		});

		this.previewLabel = new LabelView(locale);
		this.previewLabel.text = t("Equation preview");

		this.saveButtonView = this.createButton(t("Save"), IconCheck, "ck-button-save");
		this.saveButtonView.type = "submit";

		this.cancelButtonView = this.createButton(t("Cancel"), IconCancel, "ck-button-cancel");
		this.cancelButtonView.delegate("execute").to(this, "cancel");

		this.actionsView = new View(locale);
		this.actionsView.setTemplate({
			tag: "div",
			attributes: { class: ["ck", "ck-math-form__actions"] },
			children: [this.saveButtonView, this.cancelButtonView],
		});

		this.on("change:displayMode", () => this.updatePreview());

		this.setTemplate({
			tag: "form",
			attributes: {
				class: ["ck", "ck-math-form"],
				tabindex: "-1",
			},
			children: [this.equationInputView, this.displayButtonView, this.previewLabel, this.previewView, this.actionsView],
		});
	}

	override render() {
		super.render();
		this.previewRenderElement = document.createElement("div");
		this.previewRenderElement.className = "ck-math-preview__rendered";
		document.body.appendChild(this.previewRenderElement);

		submitHandler({ view: this });
		(this.equationInputView.fieldView.element as HTMLInputElement).addEventListener("input", () =>
			this.updatePreview()
		);

		this.element!.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.fire("cancel");
				event.stopPropagation();
			}
		});
	}

	override destroy() {
		this.previewRenderElement?.remove();
		super.destroy();
	}

	// The overlay lives on document.body, so it must be cleared when the balloon hides, not just on destroy.
	hidePreview() {
		if (!this.previewRenderElement) {
			return;
		}
		this.previewRenderElement.textContent = "";
		this.previewRenderElement.style.visibility = "hidden";
		this.previewRenderElement.style.display = "none";
		if (this.previewView.element) {
			this.previewView.element.style.height = "";
		}
	}

	focus() {
		this.equationInputView.focus();
	}

	get equation(): string {
		return (this.equationInputView.fieldView.element as HTMLInputElement).value.trim();
	}

	set equation(value: string) {
		const field = this.equationInputView.fieldView as typeof this.equationInputView.fieldView & {
			value: string;
		};
		field.value = value;

		if (field.element) {
			(field.element as HTMLInputElement).value = value;
		}

		this.updatePreview();
	}

	updatePreview() {
		const { element } = this.previewView;

		if (!element || !this.previewRenderElement) {
			return;
		}

		const { equation } = this;

		if (!equation) {
			this.hidePreview();
			return;
		}

		renderEquation(equation, this.previewRenderElement, this.displayMode);
		this.positionPreview();
	}

	private positionPreview() {
		const { element } = this.previewView;

		if (!element || !this.previewRenderElement) {
			return;
		}

		const rect = element.getBoundingClientRect();
		Object.assign(this.previewRenderElement.style, {
			display: "block",
			visibility: "hidden",
			left: `${rect.left}px`,
			top: `${rect.top}px`,
			width: `${rect.width}px`,
			height: "auto",
		});

		const height = Math.max(rect.height, this.previewRenderElement.scrollHeight);

		element.style.height = `${height}px`;
		Object.assign(this.previewRenderElement.style, {
			display: "flex",
			visibility: "visible",
			left: `${rect.left}px`,
			top: `${rect.top}px`,
			width: `${rect.width}px`,
			height: `${height}px`,
		});
	}

	private createButton(label: string, icon: string, className: string) {
		const button = new ButtonView(this.locale);

		button.set({
			label,
			icon,
			tooltip: true,
			class: className,
		});

		return button;
	}
}
