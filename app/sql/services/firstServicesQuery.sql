SELECT service_id as serviceId,
  name,
  description,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
FROM services
ORDER BY service_id DESC
LIMIT $1