import type { RouteObject } from "react-router";
import {
	ServicesListRoute,
	servicesListLoader,
} from "~/renderer/routes/services/services-list";

export const servicesRoutes: RouteObject[] = [
	{
		path: "/services",
		loader: servicesListLoader,
		Component: ServicesListRoute,
	},
];
