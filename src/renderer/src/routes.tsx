import {
	createBrowserRouter,
	unstable_createContext,
	type unstable_RouterContext,
} from "react-router";
import { RootRoute } from "~/renderer/root";
import { companiesRoutes } from "~/renderer/routes/companies/companies-routes";
import { customersRoutes } from "~/renderer/routes/customers/customers-routes";
import { DashboardRoute } from "~/renderer/routes/dashboard";
import { servicesRoutes } from "~/renderer/routes/services/services-routes";
import { taxesRoutes } from "~/renderer/routes/taxes/taxes-routes";
import type { UserSetting } from "~/types";

export const userSettingsContext =
	unstable_createContext<Map<string, UserSetting>>();

export const router = createBrowserRouter(
	[
		{
			Component: RootRoute,
			children: [
				{
					index: true,
					Component: DashboardRoute,
				},
				...companiesRoutes,
				...customersRoutes,
				...servicesRoutes,
				...taxesRoutes,
			],
		},
	],
	{
		unstable_getContext: async () => {
			const map = new Map<unstable_RouterContext, Map<string, UserSetting>>();
			const userSettings = await window.api.db.userSettings.get();
			const userSettingsMap = new Map(
				userSettings.map((userSetting) => [
					userSetting.settingKey,
					userSetting,
				]),
			);
			map.set(userSettingsContext, userSettingsMap);

			return map;
		},
	},
);

declare module "react-router" {
	interface LoaderFunctionArgs {
		context: Map<
			unstable_RouterContext,
			Map<UserSetting["settingKey"], UserSetting>
		>;
	}
}
