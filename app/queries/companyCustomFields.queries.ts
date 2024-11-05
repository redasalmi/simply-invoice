import { createCompanyCustomFieldQuery } from '~/sql/companyCustomFields.sql';

export type CompanyCustomField = {
	companyCustomFieldId: string;
	customFieldIndex: number;
	label: string;
	content: string;
	companyId: string;
	createdAt: string;
	updatedAt?: string;
};

export async function createCompanyCustomField(
	companyCustomField: Omit<CompanyCustomField, 'createdAt' | 'updatedAt'>,
) {
	return window.db.execute(createCompanyCustomFieldQuery, [
		companyCustomField.companyCustomFieldId,
		companyCustomField.customFieldIndex,
		companyCustomField.label,
		companyCustomField.content,
		companyCustomField.companyId,
	]);
}
