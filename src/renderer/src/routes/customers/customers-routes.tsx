import type { RouteObject } from "react-router";
import { CustomerDetailRoute, customerDetailLoader } from "./customer-detail";
import { CustomersListRoute, customersListLoader } from "./customers-list";

export const customersRoutes: RouteObject[] = [
	{
		path: "/customers",
		loader: customersListLoader,
		Component: CustomersListRoute,
		children: [
			{
				path: "detail/:customerId",
				loader: customerDetailLoader,
				Component: CustomerDetailRoute,
			},
		],
	},
];
