import {
	createCompanyCustomFieldSql,
	deleteCompanyCustomFieldSql,
	updateCompanyCustomFieldSql,
} from '~/sql/companyCustomFields.sql';
import { CompanyCustomField } from '~/types';

type CreateCompanyCustomFieldInput = Omit<
	CompanyCustomField,
	'createdAt' | 'updatedAt'
>;

export async function createCompanyCustomField(
	companyCustomField: CreateCompanyCustomFieldInput,
) {
	return window.db.execute(createCompanyCustomFieldSql, [
		companyCustomField.companyCustomFieldId,
		companyCustomField.customFieldIndex,
		companyCustomField.label,
		companyCustomField.content,
		companyCustomField.companyId,
	]);
}

type UpdateCompanyCustomFieldInput = Omit<
	CompanyCustomField,
	'companyId' | 'createdAt' | 'updatedAt'
>;

export async function updateCompanyCustomField(
	companyCustomField: UpdateCompanyCustomFieldInput,
) {
	return window.db.execute(updateCompanyCustomFieldSql, [
		companyCustomField.customFieldIndex,
		companyCustomField.label,
		companyCustomField.content,
		companyCustomField.companyCustomFieldId,
	]);
}

export async function deleteCompanyCustomField(companyCustomFieldId: string) {
	return window.db.execute(deleteCompanyCustomFieldSql, [companyCustomFieldId]);
}
