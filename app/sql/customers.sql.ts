export const getCustomersCountSql = /* sql */ `
SELECT COUNT(customer_id) FROM customers;
`;

export const getCustomersSql = /* sql */ `
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
    WHERE c.customer_id > $1
    ORDER BY c.customer_id DESC
    LIMIT $2
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id;
`;

export const getCustomersHasPreviousPageSql = /* sql */ `
SELECT COUNT(customer_id)
FROM customers
WHERE customer_id < (
    SELECT customer_id
    FROM customers
    WHERE customer_id = $1
  )
ORDER BY customer_id DESC
LIMIT $2 + 1
`;

export const getCustomersHasNextPageSql = /* sql */ `
SELECT COUNT(customer_id)
FROM customers
WHERE customer_id > (
    SELECT customer_id
    FROM customers
    WHERE customer_id = $1
  )
ORDER BY customer_id DESC
LIMIT $2 + 1
`;

export const getCustomerSql = /* sql */ `
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
    WHERE c.customer_id = $1
  ) c
  LEFT JOIN addresses as a ON a.address_id = c.address_id;
`;

export const createCustomerSql = /* sql */ `
INSERT INTO customers (customer_id, name, email, address_id, additional_information) VALUES ($1, $2, $3, $4, JSON_INSERT($5));
`;

export const updateCustomerSql = /* sql */ `
UPDATE customers 
SET name = $1, email = $2, additional_information = JSON_INSERT($3), updated_at = CURRENT_TIMESTAMP
WHERE customer_id = $4;
`;

export const deleteCustomerSql = /* sql */ `
DELETE FROM customers
WHERE customer_id = $1;
`;
