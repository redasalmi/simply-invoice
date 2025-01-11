import allCustomersQuery from '~/sql/customers/allCustomersQuery.sql?raw';
import customersCountQuery from '~/sql/customers/customersCountQuery.sql?raw';
import customersHasNextPageQuery from '~/sql/customers/customersHasNextPageQuery.sql?raw';
import customersHasPreviousPageQuery from '~/sql/customers/customersHasPreviousPageQuery.sql?raw';
import firstCustomersQuery from '~/sql/customers/firstCustomersQuery.sql?raw';
import previousCustomersQuery from '~/sql/customers/previousCustomersQuery.sql?raw';
import nextCustomersQuery from '~/sql/customers/nextCustomersQuery.sql?raw';
import customerQuery from '~/sql/customers/customerQuery.sql?raw';
import createCustomerMutation from '~/sql/customers/createCustomerMutation.sql?raw';
import deleteCustomerMutation from '~/sql/customers/deleteCustomerMutation.sql?raw';
import updateCustomerMutation from '~/sql/customers/updateCustomerMutation.sql?raw';

export {
	allCustomersQuery,
	customersCountQuery,
	customersHasNextPageQuery,
	customersHasPreviousPageQuery,
	firstCustomersQuery,
	previousCustomersQuery,
	nextCustomersQuery,
	customerQuery,
	createCustomerMutation,
	deleteCustomerMutation,
	updateCustomerMutation,
};
