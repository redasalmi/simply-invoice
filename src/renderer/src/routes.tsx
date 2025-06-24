import { createBrowserRouter } from "react-router";
import { RootRoute } from "~/renderer/root";
import {
	CompaniesListRoute,
	companiesListLoader,
} from "~/renderer/routes/companies/companies-list";
import {
	CompanyCreateRoute,
	companyCreateAction,
} from "~/renderer/routes/companies/company-create";
import { HomeRoute } from "~/renderer/routes/home";
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
				path: "/companies/create",
				action: companyCreateAction,
				Component: CompanyCreateRoute,
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
