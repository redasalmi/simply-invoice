import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	{
		settings: {
			react: {
				version: '19',
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	pluginReact.configs.flat['jsx-runtime'],
	{
		plugins: {
			'react-hooks': pluginReactHooks,
		},
		rules: pluginReactHooks.configs['recommended-latest'].rules,
	},
	pluginJsxA11y.flatConfigs.recommended,
	eslintConfigPrettier,
];
