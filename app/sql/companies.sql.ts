export const getCompaniesCountSql = /* sql */ `
SELECT COUNT(company_id) FROM companies;
`;

export const getCompaniesSql = /* sql */ `
SELECT c.company_id as companyId,
  c.name,
  c.email,
  c.created_at as createdAt,
  c.updated_at as updatedAt,
  c.address_id as addressId,
  a.address1,
  a.address2,
  a.city,
  a.country,
  a.province,
  a.zip,
  ccf.company_custom_field_id as companyCustomFieldId,
  ccf.custom_field_index as customFieldIndex,
  ccf.label,
  ccf.content
FROM (
    SELECT c.company_id,
      c.name,
      c.email,
      c.created_at,
      c.updated_at,
      c.address_id
    FROM companies as c
    WHERE c.company_id > $1
    ORDER BY c.company_id DESC
    LIMIT $2
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id
  LEFT JOIN companies_custom_fields as ccf ON ccf.company_id = c.company_id;
`;

export const getCompaniesHasPreviousPageSql = /* sql */ `
SELECT COUNT(company_id)
FROM companies
WHERE company_id < (
    SELECT company_id
    FROM companies
    WHERE company_id = $1
  )
ORDER BY company_id DESC
LIMIT $2 + 1
`;

export const getCompaniesHasNextPageSql = /* sql */ `
SELECT COUNT(company_id)
FROM companies
WHERE company_id > (
    SELECT company_id
    FROM companies
    WHERE company_id = $1
  )
ORDER BY company_id DESC
LIMIT $2 + 1
`;

export const getCompanySql = /* sql */ `
SELECT c.company_id as companyId,
  c.name,
  c.email,
  c.created_at as createdAt,
  c.updated_at as updatedAt,
  c.address_id as addressId,
  a.address1,
  a.address2,
  a.city,
  a.country,
  a.province,
  a.zip,
  ccf.company_custom_field_id as companyCustomFieldId,
  ccf.custom_field_index as customFieldIndex,
  ccf.label,
  ccf.content
FROM (
    SELECT c.company_id,
      c.name,
      c.email,
      c.created_at,
      c.updated_at,
      c.address_id
    FROM companies as c
    WHERE c.company_id = $1
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id
  LEFT JOIN companies_custom_fields as ccf ON ccf.company_id = c.company_id;
`;

export const createCompanySql = /* sql */ `
INSERT INTO companies (company_id, name, email, address_id) VALUES ($1, $2, $3, $4);
`;

export const updateCompanySql = /* sql */ `
UPDATE companies 
SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
WHERE company_id = $3;
`;

export const deleteCompanySql = /* sql */ `
DELETE FROM companies
WHERE company_id = $1;
`;
