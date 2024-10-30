import createCompanySql from '~/sql/create-company.sql?raw';

export type Company = {
	company_id: string;
	name: string;
	email: string;
	address_id: string;
	created_at: string;
	updated_at?: string;
};

export async function createCompany(
	company: Omit<Company, 'created_at' | 'updated_at'>,
) {
	return window.db.execute(createCompanySql, [
		company.company_id,
		company.name,
		company.email,
		company.address_id,
	]);
}
