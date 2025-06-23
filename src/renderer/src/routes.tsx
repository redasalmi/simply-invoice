import { RootRoute } from "@renderer/root";
import { HomeRoute } from "@renderer/routes/home";
import {
	TaxCreateRoute,
	taxCreateAction,
} from "@renderer/routes/taxes/tax-create";
import {
	TaxesListRoute,
	taxesListLoader,
} from "@renderer/routes/taxes/taxes-list";
import { createBrowserRouter } from "react-router";
import {
	CompaniesListRoute,
	companiesListLoader,
} from "./routes/companies/companies-list";
import {
	TaxDeleteRoute,
	taxDeleteAction,
	taxDeleteLoader,
} from "./routes/taxes/tax-delete";
import { TaxDetailRoute, taxDetailLoader } from "./routes/taxes/tax-detail";
import {
	TaxUpdateRoute,
	taxUpdateAction,
	taxUpdateLoader,
} from "./routes/taxes/tax-update";

export const router = createBrowserRouter([
	{
		Component: RootRoute,
		children: [
			{
				index: true,
				Component: HomeRoute,
			},
			{
				path: "/companies",
				loader: companiesListLoader,
				Component: CompaniesListRoute,
			},
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
		],
	},
]);
