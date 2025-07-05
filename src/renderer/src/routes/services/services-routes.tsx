import type { RouteObject } from "react-router";
import {
	ServiceCreateRoute,
	serviceCreateAction,
} from "~/renderer/routes/services/service-create";
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
	{
		path: "/services/create",
		action: serviceCreateAction,
		Component: ServiceCreateRoute,
	},
];
