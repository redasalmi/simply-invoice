SELECT COUNT(service_id)
FROM services
WHERE service_id > (
    SELECT service_id
    FROM services
    WHERE service_id = $1
  )
ORDER BY service_id DESC
LIMIT $2 + 1