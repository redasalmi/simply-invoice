SELECT service_id as serviceId,
  name,
  description,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
FROM services
WHERE service_id < $1
ORDER BY service_id DESC
LIMIT $2