import * as sql from '~/sql/companies.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Address, Company, PaginatedResult } from '~/types';

type CompaniesSelectResult = Array<
	Omit<Company, 'address' | 'additionalInformation'> &
		Address & {
			additionalInformation: string | null;
		}
>;

type CompaniesCountResult = [
	{
		'COUNT(company_id)': number;
	},
];

function parseCompaniesSelectResult(companiesData: CompaniesSelectResult) {
	const companies: Array<Company> = [];

	for (let index = 0; index < companiesData.length; index++) {
		const {
			companyId,
			name,
			email,
			additionalInformation,
			createdAt,
			updatedAt,
			addressId,
			address1,
			address2,
			city,
			country,
			province,
			zip,
		} = companiesData[index];

		companies.push({
			companyId,
			name: name,
			email: email,
			additionalInformation: additionalInformation
				? JSON.parse(additionalInformation)
				: undefined,
			createdAt,
			updatedAt,
			address: {
				addressId,
				address1,
				address2,
				city,
				country,
				province,
				zip,
			},
		});
	}

	return companies;
}

export async function getCompanies(
	startCursor: string = '',
): Promise<PaginatedResult<Company>> {
	const [companiesData, companiesCount] = await Promise.all([
		window.db.select<CompaniesSelectResult>(sql.companiesQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CompaniesCountResult>(sql.companiesCountQuery),
	]);

	if (!companiesData.length) {
		return emptyResult as PaginatedResult<Company>;
	}

	const endCursor = companiesData[companiesData.length - 1].companyId;

	const [hasPreviousCompaniesCount, hasNextCompaniesCount] = await Promise.all([
		window.db.select<CompaniesCountResult>(sql.companiesHasPreviousPageQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CompaniesCountResult>(sql.companiesHasNextPageQuery, [
			endCursor,
			itemsPerPage,
		]),
	]);

	const companies = parseCompaniesSelectResult(companiesData);

	const total = companiesCount[0]['COUNT(company_id)'];
	const hasNextPage = Boolean(hasNextCompaniesCount[0]['COUNT(company_id)']);
	const hasPreviousPage = Boolean(
		hasPreviousCompaniesCount[0]['COUNT(company_id)'],
	);

	return {
		items: companies,
		total,
		pageInfo: {
			endCursor,
			hasNextPage,
			hasPreviousPage,
			startCursor,
		},
	};
}

export async function getCompany(companyId: string) {
	const companiesData = await window.db.select<CompaniesSelectResult>(
		sql.companyQuery,
		[companyId],
	);

	if (!companiesData.length) {
		return undefined;
	}

	const companies = parseCompaniesSelectResult(companiesData);

	return companies[0];
}

type CreateCompanyInput = Pick<Company, 'companyId' | 'name' | 'email'> & {
	additionalInformation?: string;
	addressId: string;
};

export async function createCompany(company: CreateCompanyInput) {
	return window.db.execute(sql.createCompanyMutation, [
		company.companyId,
		company.name,
		company.email,
		company.addressId,
		company.additionalInformation,
	]);
}

type UpdateCompanyInput = Pick<Company, 'companyId' | 'name' | 'email'> & {
	additionalInformation?: string;
};

export async function updateCompany(company: UpdateCompanyInput) {
	return window.db.execute(sql.updateCompanyMutation, [
		company.name,
		company.email,
		company.additionalInformation,
		company.companyId,
	]);
}

export async function deleteCompany(companyId: string) {
	return window.db.execute(sql.deleteCompanyMutation, [companyId]);
}
