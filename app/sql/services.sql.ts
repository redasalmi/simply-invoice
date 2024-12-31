export const servicesCountQuery = /* sql */ `
SELECT COUNT(service_id) FROM services;
`;

export const allServicesQuery = /* sql */ `
SELECT service_id as serviceId,
  name
  FROM services
  ORDER BY service_id DESC;
`;

export const servicesQuery = /* sql */ `
SELECT service_id as serviceId,
  name,
  description,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
  FROM services WHERE service_id > $1
  ORDER BY service_id DESC
  LIMIT $2;
`;

export const servicesHasPreviousPageQuery = /* sql */ `
SELECT COUNT(service_id) 
FROM services
WHERE service_id < (
    SELECT service_id
    FROM services
    WHERE service_id = $1
  )
ORDER BY service_id DESC
LIMIT $2 + 1
`;

export const servicesHasNextPageQuery = /* sql */ `
SELECT COUNT(service_id)
FROM services
WHERE service_id > (
    SELECT service_id
    FROM services
    WHERE service_id = $1
  )
ORDER BY service_id DESC
LIMIT $2 + 1
`;

export const serviceQuery = /* sql */ `
SELECT service_id as serviceId,
  name,
  description,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
  FROM services WHERE service_id = $1;
`;

export const createServiceMutation = /* sql */ `
INSERT INTO services (service_id, name, description, rate) VALUES ($1, $2, $3, $4);
`;

export const updateServiceMutation = /* sql */ `
UPDATE services
SET name = $1, description = $2, rate = $3, updated_at = CURRENT_TIMESTAMP
WHERE service_id = $4;
`;

export const deleteServiceMutation = /* sql */ `
DELETE FROM services
WHERE service_id = $1;
`;
