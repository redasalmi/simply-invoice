import allTaxesQuery from '~/sql/taxes/allTaxesQuery.sql?raw';
import taxesCountQuery from '~/sql/taxes/taxesCountQuery.sql?raw';
import taxesHasNextPageQuery from '~/sql/taxes/taxesHasNextPageQuery.sql?raw';
import taxesHasPreviousPageQuery from '~/sql/taxes/taxesHasPreviousPageQuery.sql?raw';
import firstTaxesQuery from '~/sql/taxes/firstTaxesQuery.sql?raw';
import previousTaxesQuery from '~/sql/taxes/previousTaxesQuery.sql?raw';
import nextTaxesQuery from '~/sql/taxes/nextTaxesQuery.sql?raw';
import taxQuery from '~/sql/taxes/taxQuery.sql?raw';
import createTaxMutation from '~/sql/taxes/createTaxMutation.sql?raw';
import deleteTaxMutation from '~/sql/taxes/deleteTaxMutation.sql?raw';
import updateTaxMutation from '~/sql/taxes/updateTaxMutation.sql?raw';

export {
	allTaxesQuery,
	taxesCountQuery,
	taxesHasNextPageQuery,
	taxesHasPreviousPageQuery,
	firstTaxesQuery,
	previousTaxesQuery,
	nextTaxesQuery,
	taxQuery,
	createTaxMutation,
	deleteTaxMutation,
	updateTaxMutation,
};
