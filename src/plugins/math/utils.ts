export const MODEL_INLINE = "mathtex-inline";
export const MODEL_DISPLAY = "mathtex-display";

export function extractDelimiters(rawEquation: string): { equation: string; display: boolean } {
	const trimmed = rawEquation.trim();
	const hasInlineDelimiters = trimmed.includes("\\(") && trimmed.includes("\\)");
	const hasDisplayDelimiters = trimmed.includes("\\[") && trimmed.includes("\\]");

	if (hasInlineDelimiters || hasDisplayDelimiters) {
		return {
			equation: trimmed.substring(2, trimmed.length - 2).trim(),
			display: hasDisplayDelimiters,
		};
	}

	return { equation: trimmed, display: false };
}

export function addDelimiters(equation: string, display: boolean): string {
	return display ? `\\[${equation}\\]` : `\\(${equation}\\)`;
}

export function renderEquation(equation: string, element: HTMLElement, display = false): void {
	const { katex } = window as Window & {
		katex?: { render: (tex: string, el: HTMLElement, options: Record<string, unknown>) => void };
	};

	// KaTeX is loaded globally with `defer`; show the raw source rather than nothing.
	if (!katex) {
		element.textContent = addDelimiters(equation, display);
		return;
	}

	katex.render(equation, element, { throwOnError: false, displayMode: display });
}
