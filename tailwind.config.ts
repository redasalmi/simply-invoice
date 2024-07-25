import type { Config } from 'tailwindcss';
import { mauve, violet, red, blackA } from '@radix-ui/colors';

const config = {
	darkMode: ['class'],
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				...mauve,
				...violet,
				...red,
				...blackA,
			},
			keyframes: {
				contentShow: {
					from: {
						opacity: '0',
						transform: 'translate(-50%, -48%) scale(0.96)',
					},
					to: {
						opacity: '1',
						transform: 'translate(-50%, -50%) scale(1)',
					},
				},
			},
			animation: {
				overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
