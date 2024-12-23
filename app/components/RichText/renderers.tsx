import {
	type RenderAnnotationFunction,
	type RenderDecoratorFunction,
	type RenderStyleFunction,
} from '@portabletext/editor';

export const renderDecorator: RenderDecoratorFunction = ({
	value,
	children,
}) => {
	if (value === 'strong') {
		return <strong>{children}</strong>;
	}

	if (value === 'em') {
		return <em>{children}</em>;
	}

	if (value === 'underline') {
		return <u>{children}</u>;
	}

	return children;
};

export const renderAnnotation: RenderAnnotationFunction = ({
	schemaType,
	children,
}) => {
	if (schemaType.name === 'link') {
		return <span className="underline">{children}</span>;
	}

	return children;
};

export const renderStyle: RenderStyleFunction = ({ schemaType, children }) => {
	if (schemaType.value === 'h1') {
		return <h1>{children}</h1>;
	}

	if (schemaType.value === 'h2') {
		return <h2>{children}</h2>;
	}

	if (schemaType.value === 'h3') {
		return <h3>{children}</h3>;
	}

	if (schemaType.value === 'blockquote') {
		return <blockquote>{children}</blockquote>;
	}

	return children;
};
