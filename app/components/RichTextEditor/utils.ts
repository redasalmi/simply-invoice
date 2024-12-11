import {
	$isTextNode,
	type DOMConversionMap,
	type DOMExportOutput,
	type DOMExportOutputMap,
	type Klass,
	type LexicalEditor,
	type LexicalNode,
	ParagraphNode,
	TextNode,
} from 'lexical';
import {
	parseAllowedColor,
	parseAllowedFontSize,
} from '~/components/RichTextEditor/styles';

export function getExtraStyles(element: HTMLElement) {
	// Parse styles from pasted input, but only if they match exactly the
	// sort of styles that would be produced by exportDOM
	let extraStyles = '';

	const fontSize = parseAllowedFontSize(element.style.fontSize);
	const backgroundColor = parseAllowedColor(element.style.backgroundColor);
	const color = parseAllowedColor(element.style.color);

	if (fontSize !== '' && fontSize !== '15px') {
		extraStyles += `font-size: ${fontSize};`;
	}

	if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
		extraStyles += `background-color: ${backgroundColor};`;
	}

	if (color !== '' && color !== 'rgb(0, 0, 0)') {
		extraStyles += `color: ${color};`;
	}

	return extraStyles;
}

export function constructImportMap() {
	const importMap: DOMConversionMap = {};

	// Wrap all TextNode importers with a function that also imports
	// the custom styles implemented by the playground
	for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
		importMap[tag] = (importNode) => {
			const importer = fn(importNode);
			if (!importer) {
				return null;
			}

			return {
				...importer,
				conversion: (element) => {
					const output = importer.conversion(element);
					if (
						output === null ||
						output.forChild === undefined ||
						output.after !== undefined ||
						output.node !== null
					) {
						return output;
					}
					const extraStyles = getExtraStyles(element);
					if (extraStyles) {
						const { forChild } = output;
						return {
							...output,
							forChild: (child, parent) => {
								const textNode = forChild(child, parent);
								if ($isTextNode(textNode)) {
									textNode.setStyle(textNode.getStyle() + extraStyles);
								}
								return textNode;
							},
						};
					}
					return output;
				},
			};
		};
	}

	return importMap;
}

export function removeStylesExportDOM(
	editor: LexicalEditor,
	target: LexicalNode,
) {
	const output = target.exportDOM(editor);
	if (output && output.element instanceof HTMLElement) {
		// Remove all inline styles and classes if the element is an HTMLElement
		// Children are checked as well since TextNode can be nested
		// in i, b, and strong tags.
		for (const el of [
			output.element,
			...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
		]) {
			el.removeAttribute('class');
			el.removeAttribute('style');
			if (el.getAttribute('dir') === 'ltr') {
				el.removeAttribute('dir');
			}
		}
	}

	return output;
}

export const exportMap: DOMExportOutputMap = new Map<
	Klass<LexicalNode>,
	(editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
	[ParagraphNode, removeStylesExportDOM],
	[TextNode, removeStylesExportDOM],
]);
