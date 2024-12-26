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
  JSON_EXTRACT(c.additional_information, '$') as additionalInformation,
  a.address1,
  a.address2,
  a.city,
  a.country,
  a.province,
  a.zip
FROM (
    SELECT c.company_id,
      c.name,
      c.email,
      c.created_at,
      c.updated_at,
      c.address_id,
      c.additional_information
    FROM companies as c
    WHERE c.company_id > $1
    ORDER BY c.company_id DESC
    LIMIT $2
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id;
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
  JSON_EXTRACT(c.additional_information, '$') as additionalInformation,
  a.address1,
  a.address2,
  a.city,
  a.country,
  a.province,
  a.zip
FROM (
    SELECT c.company_id,
      c.name,
      c.email,
      c.created_at,
      c.updated_at,
      c.address_id,
      c.additional_information
    FROM companies as c
    WHERE c.company_id = $1
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id;
`;

export const createCompanySql = /* sql */ `
INSERT INTO companies (company_id, name, email, address_id, additional_information) VALUES ($1, $2, $3, $4, JSON_INSERT($5));
`;

export const updateCompanySql = /* sql */ `
UPDATE companies 
SET name = $1, email = $2, additional_information = JSON_INSERT($3), updated_at = CURRENT_TIMESTAMP
WHERE company_id = $4;
`;

export const deleteCompanySql = /* sql */ `
DELETE FROM companies
WHERE company_id = $1;
`;
