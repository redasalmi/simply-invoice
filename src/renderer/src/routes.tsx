import { RootRoute } from "@renderer/root";
import { HomeRoute } from "@renderer/routes/home";
import { TaxesListRoute, taxesLoader } from "@renderer/routes/taxes/taxes-list";
import { createBrowserRouter } from "react-router";

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
				children: [
					{
						index: true,
						loader: taxesLoader,
						Component: TaxesListRoute,
					},
				],
			},
		],
	},
]);
