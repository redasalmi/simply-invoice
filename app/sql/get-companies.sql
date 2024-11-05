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
FROM companies as c
  LEFT JOIN addresses as a ON a.address_id = c.address_id
  LEFT JOIN companies_custom_fields as ccf ON ccf.company_id = c.company_id;