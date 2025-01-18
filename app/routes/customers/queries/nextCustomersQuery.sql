SELECT c.customer_id as customerId,
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
    SELECT c.customer_id,
      c.name,
      c.email,
      c.created_at,
      c.updated_at,
      c.address_id,
      c.additional_information
    FROM customers as c
    WHERE c.customer_id < $1
    ORDER BY c.customer_id DESC
    LIMIT $2
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id