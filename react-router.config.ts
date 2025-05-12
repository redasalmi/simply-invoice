import type { Config } from '@react-router/dev/config';

export default {
	ssr: false,
	future: {
		unstable_optimizeDeps: true,
		unstable_middleware: true,
		unstable_splitRouteModules: true,
		unstable_subResourceIntegrity: true,
		unstable_viteEnvironmentApi: true,
	},
} satisfies Config;
