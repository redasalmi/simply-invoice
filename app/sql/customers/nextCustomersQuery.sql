SELECT c.customer_id as customerId,
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