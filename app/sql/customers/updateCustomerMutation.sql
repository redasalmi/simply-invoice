UPDATE customers
SET name = $1,
  email = $2,
  additional_information = JSON_INSERT($3),
  updated_at = CURRENT_TIMESTAMP
WHERE customer_id = $4