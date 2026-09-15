export const MODEL_INLINE = "mathtex-inline";
export const MODEL_DISPLAY = "mathtex-display";

// Anchored to start/end so delimiters elsewhere in the text (or mismatched pairs) don't trigger extraction.
const DISPLAY_DELIMITERS = /^\\\[(.*)\\\]$/s;
const INLINE_DELIMITERS = /^\\\((.*)\\\)$/s;

export function extractDelimiters(rawEquation: string): { equation: string; display: boolean } {
	const trimmed = rawEquation.trim();

	const displayMatch = trimmed.match(DISPLAY_DELIMITERS);
	if (displayMatch) {
		return { equation: displayMatch[1].trim(), display: true };
	}

	const inlineMatch = trimmed.match(INLINE_DELIMITERS);
	if (inlineMatch) {
		return { equation: inlineMatch[1].trim(), display: false };
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
