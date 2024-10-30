import createCompanyCustomFieldsSql from '~/sql/create-company-custom-fields.sql?raw';

export type CompanyCustomField = {
	company_custom_field_id: string;
	custom_field_index: number;
	label: string;
	content: string;
	company_id: string;
	created_at: string;
	updated_at?: string;
};

export async function createCompanyCustomField(
	companyCustomField: Omit<CompanyCustomField, 'created_at' | 'updated_at'>,
) {
	return window.db.execute(createCompanyCustomFieldsSql, [
		companyCustomField.company_custom_field_id,
		companyCustomField.custom_field_index,
		companyCustomField.label,
		companyCustomField.content,
		companyCustomField.company_id,
	]);
}
