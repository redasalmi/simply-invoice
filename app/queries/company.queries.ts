import getCompaniesSql from '~/sql/get-companies.sql?raw';
import createCompanySql from '~/sql/create-company.sql?raw';
import { Address } from './address.queries';
import { CompanyCustomField } from './company-custom-fields.queries';

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

type CompaniesSelectResult = Omit<Company, 'address' | 'customFields'> &
	Omit<Address, 'createdAt' | 'updatedAt'> &
	Omit<CompanyCustomField, 'companyId' | 'createdAt' | 'updatedAt'>;

type CompanyInsertInput = Pick<Company, 'companyId' | 'name' | 'email'> & {
	addressId: string;
};

export async function getCompanies() {
	const companiesData =
		await window.db.select<Array<CompaniesSelectResult>>(getCompaniesSql);

	const companies = new Map();

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
				companies.set(companyId, {
					...companies.get(companyId),
					customFields: [
						...companies.get(companyId).customFields,
						{
							companyCustomFieldId,
							customFieldIndex,
							label,
							content,
						},
					],
				});
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

	return Array.from(companies.values());
}

export async function createCompany(company: CompanyInsertInput) {
	return window.db.execute(createCompanySql, [
		company.companyId,
		company.name,
		company.email,
		company.addressId,
	]);
}
