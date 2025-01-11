import allCompaniesQuery from '~/sql/companies/allCompaniesQuery.sql?raw';
import companiesCountQuery from '~/sql/companies/companiesCountQuery.sql?raw';
import companiesHasNextPageQuery from '~/sql/companies/companiesHasNextPageQuery.sql?raw';
import companiesHasPreviousPageQuery from '~/sql/companies/companiesHasPreviousPageQuery.sql?raw';
import firstCompaniesQuery from '~/sql/companies/firstCompaniesQuery.sql?raw';
import previousCompaniesQuery from '~/sql/companies/previousCompaniesQuery.sql?raw';
import nextCompaniesQuery from '~/sql/companies/nextCompaniesQuery.sql?raw';
import companyQuery from '~/sql/companies/companyQuery.sql?raw';
import createCompanyMutation from '~/sql/companies/createCompanyMutation.sql?raw';
import deleteCompanyMutation from '~/sql/companies/deleteCompanyMutation.sql?raw';
import updateCompanyMutation from '~/sql/companies/updateCompanyMutation.sql?raw';

export {
	allCompaniesQuery,
	companiesCountQuery,
	companiesHasNextPageQuery,
	companiesHasPreviousPageQuery,
	firstCompaniesQuery,
	previousCompaniesQuery,
	nextCompaniesQuery,
	companyQuery,
	createCompanyMutation,
	deleteCompanyMutation,
	updateCompanyMutation,
};
