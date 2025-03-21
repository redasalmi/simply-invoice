import type { Config } from '@react-router/dev/config';

export default {
	ssr: false,
	future: {
		unstable_optimizeDeps: true,
		unstable_splitRouteModules: true,
		unstable_viteEnvironmentApi: true,
		unstable_middleware: true,
	},
} satisfies Config;
