import type { RouteObject } from "react-router";
import {
	CustomerCreateRoute,
	customerCreateAction,
} from "~/renderer/routes/customers/customer-create";
import {
	CustomerDeleteRoute,
	customerDeleteAction,
	customerDeleteLoader,
} from "~/renderer/routes/customers/customer-delete";
import {
	CustomerDetailRoute,
	customerDetailLoader,
} from "~/renderer/routes/customers/customer-detail";
import {
	CustomerUpdateRoute,
	customerUpdateAction,
	customerUpdateLoader,
} from "~/renderer/routes/customers/customer-update";
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
			{
				path: "delete/:customerId",
				loader: customerDeleteLoader,
				action: customerDeleteAction,
				Component: CustomerDeleteRoute,
			},
		],
	},
	{
		path: "/customers/create",
		action: customerCreateAction,
		Component: CustomerCreateRoute,
	},
	{
		path: "/customers/update/:customerId",
		loader: customerUpdateLoader,
		action: customerUpdateAction,
		Component: CustomerUpdateRoute,
	},
];
