import type { RouteObject } from "react-router";
import { CustomersListRoute, customersListLoader } from "./customers-list";

export const customersRoutes: RouteObject[] = [
	{
		path: "/customers",
		loader: customersListLoader,
		Component: CustomersListRoute,
	},
];
