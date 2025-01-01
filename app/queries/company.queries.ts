import * as sql from '~/sql/companies/companies.sql';
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

async function getCompaniesCount() {
	const companiesCount = await window.db.select<CompaniesCountResult>(
		sql.companiesCountQuery,
	);

	return companiesCount[0]['COUNT(company_id)'];
}

export async function getAllCompanies() {
	return window.db.select<Array<Pick<Company, 'companyId' | 'name'>>>(
		sql.allCompaniesQuery,
	);
}

async function getPaginatedCompanies(startCursor: string = '') {
	return window.db.select<CompaniesSelectResult>(sql.companiesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function hasPreviousCompaniesPage(startCursor: string = '') {
	const hasPreviousCompaniesCount =
		await window.db.select<CompaniesCountResult>(
			sql.companiesHasPreviousPageQuery,
			[startCursor, itemsPerPage],
		);

	return Boolean(hasPreviousCompaniesCount[0]['COUNT(company_id)']);
}

async function hasNextCompaniesPage(endCursor: string) {
	const hasNextCompaniesCount = await window.db.select<CompaniesCountResult>(
		sql.companiesHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextCompaniesCount[0]['COUNT(company_id)']);
}

export async function getCompanies(
	startCursor: string = '',
): Promise<PaginatedResult<Company>> {
	const [companiesData, companiesTotal] = await Promise.all([
		getPaginatedCompanies(startCursor),
		getCompaniesCount(),
	]);

	if (!companiesData.length) {
		return emptyResult as PaginatedResult<Company>;
	}

	const endCursor = companiesData[companiesData.length - 1].companyId;

	const [hasPreviousPage, hasNextPage] = await Promise.all([
		hasPreviousCompaniesPage(startCursor),
		hasNextCompaniesPage(endCursor),
	]);

	const companies = parseCompaniesSelectResult(companiesData);

	return {
		items: companies,
		total: companiesTotal,
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
