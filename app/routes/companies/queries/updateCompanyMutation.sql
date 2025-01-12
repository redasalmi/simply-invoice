UPDATE companies
SET name = $1,
  email = $2,
  additional_information = JSON_INSERT($3),
  updated_at = CURRENT_TIMESTAMP
WHERE company_id = $4