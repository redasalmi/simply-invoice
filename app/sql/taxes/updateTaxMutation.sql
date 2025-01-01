UPDATE taxes
SET name = $1,
  rate = $2,
  updated_at = CURRENT_TIMESTAMP
WHERE tax_id = $3