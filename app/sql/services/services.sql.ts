import allServicesQuery from '~/sql/services/allServicesQuery.sql?raw';
import servicesCountQuery from '~/sql/services/servicesCountQuery.sql?raw';
import servicesHasNextPageQuery from '~/sql/services/servicesHasNextPageQuery.sql?raw';
import servicesHasPreviousPageQuery from '~/sql/services/servicesHasPreviousPageQuery.sql?raw';
import servicesQuery from '~/sql/services/servicesQuery.sql?raw';
import serviceQuery from '~/sql/services/serviceQuery.sql?raw';
import createServiceMutation from '~/sql/services/createServiceMutation.sql?raw';
import deleteServiceMutation from '~/sql/services/deleteServiceMutation.sql?raw';
import updateServiceMutation from '~/sql/services/updateServiceMutation.sql?raw';

export {
	allServicesQuery,
	servicesCountQuery,
	servicesHasNextPageQuery,
	servicesHasPreviousPageQuery,
	servicesQuery,
	serviceQuery,
	createServiceMutation,
	deleteServiceMutation,
	updateServiceMutation,
};
