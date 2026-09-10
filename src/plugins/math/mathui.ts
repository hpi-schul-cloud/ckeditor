import { ButtonView, ClickObserver, clickOutsideHandler, ContextualBalloon, Plugin } from "ckeditor5";

import type { MathCommand, MathValue } from "./mathcommand";
import { MathFormView } from "./ui/mathformview";
import mathIcon from "./theme/math.svg?raw";

export class MathUI extends Plugin {
	private balloon!: InstanceType<typeof ContextualBalloon>;
	private formView!: MathFormView;

	static get requires() {
		return [ContextualBalloon] as const;
	}

	static get pluginName() {
		return "MathUI" as const;
	}

	init() {
		const { editor } = this;

		// A click observer is required to react to clicks on existing math widgets.
		editor.editing.view.addObserver(ClickObserver);

		this.balloon = editor.plugins.get(ContextualBalloon);
		this.formView = this.createFormView();

		editor.ui.componentFactory.add("math", (locale) => {
			const view = new ButtonView(locale);
			const command = editor.commands.get("math") as MathCommand;

			view.set({
				label: editor.t("Insert Math"),
				icon: mathIcon,
				tooltip: true,
			});

			view.bind("isEnabled").to(command, "isEnabled");
			this.listenTo(view, "execute", () => this.showUI());

			return view;
		});

		this.enableUserBalloonInteractions();
	}

	override destroy() {
		super.destroy();
		this.formView.destroy();
	}

	private createFormView() {
		const { editor } = this;
		const formView = new MathFormView(editor.locale);

		formView.on("submit", () => {
			const { equation } = formView;

			if (equation) {
				editor.execute("math", equation, formView.displayMode);
			}

			this.hideUI();
		});

		formView.on("cancel", () => this.hideUI());

		clickOutsideHandler({
			emitter: formView,
			activator: () => this.isVisible,
			contextElements: [this.balloon.view.element!],
			callback: () => this.hideUI(),
		});

		return formView;
	}

	private get isVisible() {
		return this.balloon.visibleView === this.formView;
	}

	// Reopens the balloon when the user clicks a math widget that is already selected, matching
	// the click-to-edit behavior of the original @isaul32/ckeditor5-math plugin.
	private enableUserBalloonInteractions() {
		const { editor } = this;
		const viewDocument = editor.editing.view.document;

		this.listenTo(viewDocument, "click", () => {
			const command = editor.commands.get("math") as MathCommand;

			if (command.isEnabled && command.value && !this.isVisible) {
				this.showUI();
			}
		});
	}

	showUI() {
		if (this.isVisible) {
			return;
		}

		const { editor } = this;
		const command = editor.commands.get("math") as MathCommand;

		this.balloon.add({
			view: this.formView,
			position: this.getBalloonPositionData(),
		});

		const value: MathValue = command.value;
		this.formView.displayMode = value ? value.display : false;
		this.formView.equation = value ? value.equation : "";
		this.formView.focus();
	}

	hideUI() {
		if (!this.balloon.hasView(this.formView)) {
			return;
		}

		this.balloon.remove(this.formView);
		this.formView.hidePreview();
		this.editor.editing.view.focus();
	}

	private getBalloonPositionData() {
		const { view } = this.editor.editing;

		return {
			target: () => view.domConverter.viewRangeToDom(view.document.selection.getFirstRange()!),
		};
	}
}
