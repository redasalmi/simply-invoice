import { createBrowserRouter } from "react-router";
import { RootRoute } from "~/renderer/root";
import { companiesRoutes } from "~/renderer/routes/companies/companies-routes";
import { customersRoutes } from "~/renderer/routes/customers/customers-routes";
import { HomeRoute } from "~/renderer/routes/home";
import { servicesRoutes } from "~/renderer/routes/services/services-routes";
import { taxesRoutes } from "~/renderer/routes/taxes/taxes-routes";

export const router = createBrowserRouter([
	{
		Component: RootRoute,
		children: [
			{
				index: true,
				Component: HomeRoute,
			},
			...companiesRoutes,
			...customersRoutes,
			...servicesRoutes,
			...taxesRoutes,
		],
	},
]);
