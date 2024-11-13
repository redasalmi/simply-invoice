export const createCompanyCustomFieldSql = /* sql */ `
INSERT INTO companies_custom_fields (company_custom_field_id, custom_field_index, label, content, company_id)
VALUES ($1, $2, $3, $4, $5);
`;

export const updateCompanyCustomFieldSql = /* sql */ `
UPDATE companies_custom_fields 
SET custom_field_index = $1, label = $2, content = $3
WHERE company_custom_field_id = $4;
`;
