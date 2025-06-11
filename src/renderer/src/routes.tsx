import { createBrowserRouter } from "react-router";
import { RootRoute } from "./root";
import { HomeRoute } from "./routes/home";
import { TaxesListRoute, taxesLoader } from "./routes/taxes/taxes-list";

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
