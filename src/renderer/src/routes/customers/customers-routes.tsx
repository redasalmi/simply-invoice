import type { RouteObject } from "react-router";
import {
	CustomerCreateRoute,
	customerCreateAction,
} from "~/renderer/routes/customers/customer-create";
import {
	CustomerDetailRoute,
	customerDetailLoader,
} from "~/renderer/routes/customers/customer-detail";
import {
	CustomersListRoute,
	customersListLoader,
} from "~/renderer/routes/customers/customers-list";

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
	{
		path: "/customers/create",
		action: customerCreateAction,
		Component: CustomerCreateRoute,
	},
];
