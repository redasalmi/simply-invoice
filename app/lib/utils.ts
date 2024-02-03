import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
