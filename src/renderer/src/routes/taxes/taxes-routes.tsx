import type { RouteObject } from "react-router";
import {
	TaxCreateRoute,
	taxCreateAction,
} from "~/renderer/routes/taxes/tax-create";
import {
	TaxDeleteRoute,
	taxDeleteAction,
	taxDeleteLoader,
} from "~/renderer/routes/taxes/tax-delete";
import {
	TaxDetailRoute,
	taxDetailLoader,
} from "~/renderer/routes/taxes/tax-detail";
import {
	TaxUpdateRoute,
	taxUpdateAction,
	taxUpdateLoader,
} from "~/renderer/routes/taxes/tax-update";
import {
	TaxesListRoute,
	taxesListLoader,
} from "~/renderer/routes/taxes/taxes-list";

export const taxesRoutes: RouteObject[] = [
	{
		path: "/taxes",
		loader: taxesListLoader,
		Component: TaxesListRoute,
		children: [
			{
				path: "detail/:taxId",
				loader: taxDetailLoader,
				Component: TaxDetailRoute,
			},
			{
				path: "delete/:taxId",
				loader: taxDeleteLoader,
				action: taxDeleteAction,
				Component: TaxDeleteRoute,
			},
		],
	},
	{
		path: "/taxes/create",
		action: taxCreateAction,
		Component: TaxCreateRoute,
	},
	{
		path: "/taxes/update/:taxId",
		loader: taxUpdateLoader,
		action: taxUpdateAction,
		Component: TaxUpdateRoute,
	},
];
