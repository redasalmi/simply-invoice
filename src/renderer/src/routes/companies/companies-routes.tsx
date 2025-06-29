import type { RouteObject } from "react-router";
import {
	CompaniesListRoute,
	companiesListLoader,
} from "~/renderer/routes/companies/companies-list";
import { CompanyCreateRoute, companyCreateAction } from "./company-create";
import {
	CompanyDeleteRoute,
	companyDeleteAction,
	companyDeleteLoader,
} from "./company-delete";
import { CompanyDetailRoute, companyDetailLoader } from "./company-detail";
import {
	CompanyUpdateRoute,
	companyUpdateAction,
	companyUpdateLoader,
} from "./company-update";

export const companiesRoutes: RouteObject[] = [
	{
		path: "/companies",
		loader: companiesListLoader,
		Component: CompaniesListRoute,
		children: [
			{
				path: "detail/:companyId",
				loader: companyDetailLoader,
				Component: CompanyDetailRoute,
			},
			{
				path: "delete/:companyId",
				loader: companyDeleteLoader,
				action: companyDeleteAction,
				Component: CompanyDeleteRoute,
			},
		],
	},
	{
		path: "/companies/create",
		action: companyCreateAction,
		Component: CompanyCreateRoute,
	},
	{
		path: "/companies/update/:companyId",
		loader: companyUpdateLoader,
		action: companyUpdateAction,
		Component: CompanyUpdateRoute,
	},
];
