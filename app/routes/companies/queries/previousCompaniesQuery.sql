SELECT c.company_id as companyId,
  c.name,
  c.email,
  c.created_at as createdAt,
  c.updated_at as updatedAt,
  c.additional_information as additionalInformation,
  json_object(
    'addressId',
    a.address_id,
    'address1',
    a.address1,
    'address2',
    a.address2,
    'city',
    a.city,
    'country',
    a.country,
    'province',
    a.province,
    'zip',
    a.zip
  ) address
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
    ORDER BY c.company_id ASC
    LIMIT $2
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id
ORDER BY company_id DESC