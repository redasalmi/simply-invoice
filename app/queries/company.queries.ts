import {
	getCompaniesQuery,
	getCompaniesCountQuery,
	getCompaniesHasPreviousPageQuery,
	getCompaniesHasNextPageQuery,
	createCompanyQuery,
	getCompanyQuery,
} from '~/sql/companies.sql';
import { Address } from '~/queries/address.queries';
import { CompanyCustomField } from '~/queries/companyCustomFields.queries';
import { itemsPerPage, type PaginatedResult } from '~/lib/pagination';

type Company = {
	companyId: string;
	name: string;
	email: string;
	address: Omit<Address, 'createdAt' | 'updatedAt'>;
	customFields: Array<
		Omit<CompanyCustomField, 'companyId' | 'createdAt' | 'updatedAt'>
	>;
	createdAt: string;
	updatedAt?: string;
};

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

type CompanyInsertInput = Pick<Company, 'companyId' | 'name' | 'email'> & {
	addressId: string;
};

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
		window.db.select<CompaniesSelectResult>(getCompaniesQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CompaniesCountResult>(getCompaniesCountQuery),
	]);

	const endCursor = companiesData[companiesData.length - 1].companyId;

	const [hasPreviousCompaniesCount, hasNextCompaniesCount] = await Promise.all([
		window.db.select<CompaniesCountResult>(getCompaniesHasPreviousPageQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CompaniesCountResult>(getCompaniesHasNextPageQuery, [
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
		getCompanyQuery,
		[companyId],
	);
	const company = parseCompaniesSelectResult(companiesData);

	return company.get(companyId);
}

export async function createCompany(company: CompanyInsertInput) {
	return window.db.execute(createCompanyQuery, [
		company.companyId,
		company.name,
		company.email,
		company.addressId,
	]);
}
