import allServicesQuery from '~/sql/services/allServicesQuery.sql?raw';
import servicesCountQuery from '~/sql/services/servicesCountQuery.sql?raw';
import servicesHasNextPageQuery from '~/sql/services/servicesHasNextPageQuery.sql?raw';
import servicesHasPreviousPageQuery from '~/sql/services/servicesHasPreviousPageQuery.sql?raw';
import firstServicesQuery from '~/sql/services/firstServicesQuery.sql?raw';
import previousServicesQuery from '~/sql/services/previousServicesQuery.sql?raw';
import nextServicesQuery from '~/sql/services/nextServicesQuery.sql?raw';
import serviceQuery from '~/sql/services/serviceQuery.sql?raw';
import createServiceMutation from '~/sql/services/createServiceMutation.sql?raw';
import deleteServiceMutation from '~/sql/services/deleteServiceMutation.sql?raw';
import updateServiceMutation from '~/sql/services/updateServiceMutation.sql?raw';

export {
	allServicesQuery,
	servicesCountQuery,
	servicesHasNextPageQuery,
	servicesHasPreviousPageQuery,
	firstServicesQuery,
	previousServicesQuery,
	nextServicesQuery,
	serviceQuery,
	createServiceMutation,
	deleteServiceMutation,
	updateServiceMutation,
};
