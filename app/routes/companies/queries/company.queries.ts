import allCompaniesQuery from '~/routes/companies/queries/allCompaniesQuery.sql?raw';
import companiesCountQuery from '~/routes/companies/queries/companiesCountQuery.sql?raw';
import nextCompaniesCountQuery from '~/routes/companies/queries/nextCompaniesCountQuery.sql?raw';
import previousCompaniesCountQuery from '~/routes/companies/queries/previousCompaniesCountQuery.sql?raw';
import firstCompaniesQuery from '~/routes/companies/queries/firstCompaniesQuery.sql?raw';
import previousCompaniesQuery from '~/routes/companies/queries/previousCompaniesQuery.sql?raw';
import nextCompaniesQuery from '~/routes/companies/queries/nextCompaniesQuery.sql?raw';
import companyQuery from '~/routes/companies/queries/companyQuery.sql?raw';
import createCompanyMutation from '~/routes/companies/queries/createCompanyMutation.sql?raw';
import deleteCompanyMutation from '~/routes/companies/queries/deleteCompanyMutation.sql?raw';
import updateCompanyMutation from '~/routes/companies/queries/updateCompanyMutation.sql?raw';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type { Company, DBCompany, PaginatedResult } from '~/types';

interface CompanySelectResult extends Omit<DBCompany, 'addressId'> {
	address: string;
}

type CompaniesCountResult = [
	{
		'COUNT(company_id)': number;
	},
];

function parseCompaniesSelectResult(companiesData: Array<CompanySelectResult>) {
	const companies: Array<Company> = [];

	for (let index = 0; index < companiesData.length; index++) {
		const {
			companyId,
			name,
			email,
			additionalInformation,
			createdAt,
			updatedAt,
			address,
		} = companiesData[index];

		companies.push({
			companyId,
			name: name,
			email: email,
			additionalInformation: additionalInformation
				? JSON.parse(additionalInformation)
				: undefined,
			address: JSON.parse(address),
			createdAt,
			updatedAt,
		});
	}

	return companies;
}

async function getCompaniesCount() {
	const companiesCount =
		await window.db.select<CompaniesCountResult>(companiesCountQuery);

	return companiesCount[0]['COUNT(company_id)'];
}

export async function getAllCompanies() {
	return window.db.select<Array<Pick<Company, 'companyId' | 'name'>>>(
		allCompaniesQuery,
	);
}

async function getPreviousCompanies(startCursor: string) {
	return window.db.select<Array<CompanySelectResult>>(previousCompaniesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function getNextCompanies(endCursor: string) {
	return window.db.select<Array<CompanySelectResult>>(nextCompaniesQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstCompanies() {
	return window.db.select<Array<CompanySelectResult>>(firstCompaniesQuery, [
		itemsPerPage,
	]);
}

async function getPreviousCompaniesCount(startCursor: string) {
	const previousCompaniesCount = await window.db.select<CompaniesCountResult>(
		previousCompaniesCountQuery,
		[startCursor, itemsPerPage],
	);

	return previousCompaniesCount[0]['COUNT(company_id)'];
}

async function getNextCompaniesCount(endCursor: string) {
	const nextCompaniesCount = await window.db.select<CompaniesCountResult>(
		nextCompaniesCountQuery,
		[endCursor, itemsPerPage],
	);

	return nextCompaniesCount[0]['COUNT(company_id)'];
}

export async function getCompanies(
	cursor: string | null,
	paginationType: PaginationType | null,
): Promise<PaginatedResult<Company>> {
	const [companiesData, companiesTotal] = await Promise.all([
		cursor && paginationType
			? paginationType === 'previous'
				? getPreviousCompanies(cursor)
				: getNextCompanies(cursor)
			: getFirstCompanies(),
		getCompaniesCount(),
	]);

	if (!companiesData.length) {
		return emptyResult as PaginatedResult<Company>;
	}

	const startCursor = companiesData[0].companyId;
	const endCursor = companiesData[companiesData.length - 1].companyId;

	const [previousCompaniesCount, nextCompaniesCount] = await Promise.all([
		getPreviousCompaniesCount(startCursor),
		getNextCompaniesCount(endCursor),
	]);

	const companies = parseCompaniesSelectResult(companiesData);

	return {
		items: companies,
		total: companiesTotal,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextCompaniesCount),
			hasPreviousPage: Boolean(previousCompaniesCount),
			startCursor,
		},
	};
}

export async function getCompany(companyId: string) {
	const companiesData = await window.db.select<Array<CompanySelectResult>>(
		companyQuery,
		[companyId],
	);

	if (!companiesData.length) {
		return undefined;
	}

	const companies = parseCompaniesSelectResult(companiesData);

	return companies[0];
}

type CreateCompanyInput = Omit<DBCompany, 'createdAt' | 'updatedAt'>;

export async function createCompany(company: CreateCompanyInput) {
	return window.db.execute(createCompanyMutation, [
		company.companyId,
		company.name,
		company.email,
		company.addressId,
		company.additionalInformation,
	]);
}

type UpdateCompanyInput = Omit<
	DBCompany,
	'addressId' | 'createdAt' | 'updatedAt'
>;

export async function updateCompany(company: UpdateCompanyInput) {
	return window.db.execute(updateCompanyMutation, [
		company.name,
		company.email,
		company.additionalInformation,
		company.companyId,
	]);
}

export async function deleteCompany(companyId: string) {
	return window.db.execute(deleteCompanyMutation, [companyId]);
}
