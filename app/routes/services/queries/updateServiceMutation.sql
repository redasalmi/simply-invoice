UPDATE services
SET name = $1,
  description = $2,
  rate = $3,
  updated_at = CURRENT_TIMESTAMP
WHERE service_id = $4