SELECT service_id as serviceId,
  name,
  description,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
FROM (
    SELECT service_id,
      name,
      description,
      rate,
      created_at,
      updated_at
    FROM services
    WHERE service_id > $1
    ORDER BY service_id ASC
    LIMIT $2
  )
ORDER BY service_id DESC;