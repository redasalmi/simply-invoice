import { RootRoute } from "@renderer/root";
import { HomeRoute } from "@renderer/routes/home";
import {
	TaxCreateRoute,
	taxCreateAction,
} from "@renderer/routes/taxes/tax-create";
import { TaxesListRoute, taxesLoader } from "@renderer/routes/taxes/taxes-list";
import { createBrowserRouter } from "react-router";
import {
	TaxDeleteRoute,
	taxDeleteAction,
	taxDeleteLoader,
} from "./routes/taxes/tax-delete";
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
				path: "/taxes",
				loader: taxesLoader,
				Component: TaxesListRoute,
				children: [
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
