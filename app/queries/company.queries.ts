import {
	getCompaniesSql,
	getCompaniesCountSql,
	getCompaniesHasPreviousPageSql,
	getCompaniesHasNextPageSql,
	createCompanySql,
	getCompanySql,
	deleteCompanySql,
	updateCompanySql,
} from '~/sql/companies.sql';
import { itemsPerPage } from '~/lib/pagination';
import type {
	Address,
	Company,
	CompanyCustomField,
	PaginatedResult,
} from '~/types';

type CompaniesSelectResult = Array<
	Omit<Company, 'address' | 'customFields'> &
		Omit<Address, 'createdAt' | 'updatedAt'> &
		Omit<CompanyCustomField, 'companyId' | 'createdAt' | 'updatedAt'>
>;

type CompaniesCountResult = [
	{
		'COUNT(company_id)': number;
	},
];

function parseCompaniesSelectResult(companiesData: CompaniesSelectResult) {
	const companies = new Map<string, Company>();

	for (let index = 0; index < companiesData.length; index++) {
		const {
			companyId,
			name,
			email,
			createdAt,
			updatedAt,
			addressId,
			address1,
			address2,
			city,
			country,
			province,
			zip,
			companyCustomFieldId,
			customFieldIndex,
			label,
			content,
		} = companiesData[index];

		if (companies.has(companyId)) {
			if (companyCustomFieldId) {
				const company = companies.get(companyId) as Company;
				const updatedCompany: Company = Object.assign(company, {
					customFields: [
						...company.customFields,
						{
							companyCustomFieldId,
							customFieldIndex,
							label,
							content,
						},
					],
				});

				companies.set(companyId, updatedCompany);
			}
		} else {
			const company: Company = {
				companyId,
				name: name,
				email: email,
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
				customFields: [],
			};
			if (companyCustomFieldId) {
				company.customFields.push({
					companyCustomFieldId,
					customFieldIndex,
					label,
					content,
				});
			}

			companies.set(companyId, company);
		}
	}

	return companies;
}

export async function getCompanies(
	startCursor: string = '',
): Promise<PaginatedResult<Company>> {
	const [companiesData, companiesCount] = await Promise.all([
		window.db.select<CompaniesSelectResult>(getCompaniesSql, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CompaniesCountResult>(getCompaniesCountSql),
	]);

	if (!companiesData.length) {
		return {
			items: [],
			total: 0,
			pageInfo: {
				endCursor: '',
				hasNextPage: false,
				hasPreviousPage: false,
				startCursor: '',
			},
		};
	}

	const endCursor = companiesData[companiesData.length - 1].companyId;

	const [hasPreviousCompaniesCount, hasNextCompaniesCount] = await Promise.all([
		window.db.select<CompaniesCountResult>(getCompaniesHasPreviousPageSql, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CompaniesCountResult>(getCompaniesHasNextPageSql, [
			endCursor,
			itemsPerPage,
		]),
	]);

	const companies = parseCompaniesSelectResult(companiesData);

	const items = Array.from(companies.values());
	const total = companiesCount[0]['COUNT(company_id)'];
	const hasNextPage = Boolean(hasNextCompaniesCount[0]['COUNT(company_id)']);
	const hasPreviousPage = Boolean(
		hasPreviousCompaniesCount[0]['COUNT(company_id)'],
	);

	return {
		items,
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
		getCompanySql,
		[companyId],
	);

	if (!companiesData.length) {
		return undefined;
	}

	const company = parseCompaniesSelectResult(companiesData);

	return company.get(companyId);
}

type CreateCompanyInput = Pick<Company, 'companyId' | 'name' | 'email'> & {
	addressId: string;
};

export async function createCompany(company: CreateCompanyInput) {
	return window.db.execute(createCompanySql, [
		company.companyId,
		company.name,
		company.email,
		company.addressId,
	]);
}

type UpdateCompanyInput = Pick<Company, 'companyId' | 'name' | 'email'>;

export async function updateCompany(company: UpdateCompanyInput) {
	return window.db.execute(updateCompanySql, [
		company.name,
		company.email,
		company.companyId,
	]);
}

export async function deleteCompany(companyId: string) {
	return window.db.execute(deleteCompanySql, [companyId]);
}
