import type { RouteObject } from "react-router";
import {
	ServiceCreateRoute,
	serviceCreateAction,
} from "~/renderer/routes/services/service-create";
import {
	ServiceDeleteRoute,
	serviceDeleteAction,
	serviceDeleteLoader,
} from "~/renderer/routes/services/service-delete";
import {
	ServiceDetailRoute,
	serviceDetailLoader,
} from "~/renderer/routes/services/service-detail";
import {
	ServiceUpdateRoute,
	serviceUpdateAction,
	serviceUpdateLoader,
} from "~/renderer/routes/services/service-update";
import {
	ServicesListRoute,
	servicesListLoader,
} from "~/renderer/routes/services/services-list";

export const servicesRoutes: Array<RouteObject> = [
	{
		path: "/services",
		loader: servicesListLoader,
		Component: ServicesListRoute,
		children: [
			{
				path: "detail/:serviceId",
				loader: serviceDetailLoader,
				Component: ServiceDetailRoute,
			},
			{
				path: "delete/:serviceId",
				loader: serviceDeleteLoader,
				action: serviceDeleteAction,
				Component: ServiceDeleteRoute,
			},
		],
	},
	{
		path: "/services/create",
		action: serviceCreateAction,
		Component: ServiceCreateRoute,
	},
	{
		path: "/services/update/:serviceId",
		loader: serviceUpdateLoader,
		action: serviceUpdateAction,
		Component: ServiceUpdateRoute,
	},
];
