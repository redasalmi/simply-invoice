export const companiesCountQuery = /* sql */ `
SELECT COUNT(companies.company_id) from companies;
`;

export const companiesHasNextPageQuery = /* sql */ `
SELECT count(*) > $1,
  c.company_id
FROM (
    SELECT c.company_id
    FROM companies as c
    order by c.company_id ASC
    LIMIT $1 + 1
  ) c;
`;

export const getCompaniesQuery = /* sql */ `
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
    from companies as c
    WHERE c.company_id > $1
    ORDER BY c.company_id ASC
    LIMIT $2
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id
  LEFT JOIN companies_custom_fields as ccf ON ccf.company_id = c.company_id;
`;

export const createCompanyQuery = /* sql */ `
INSERT INTO companies (company_id, name, email, address_id) VALUES ($1, $2, $3, $4);
`;
