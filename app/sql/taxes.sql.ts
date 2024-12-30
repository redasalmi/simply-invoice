export const taxesCountQuery = /* sql */ `
SELECT COUNT(tax_id) FROM taxes;
`;

export const taxesQuery = /* sql */ `
SELECT tax_id as taxId,
  name,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
  FROM taxes WHERE tax_id > $1
  ORDER BY tax_id DESC
  LIMIT $2;
`;

export const taxesHasPreviousPageQuery = /* sql */ `
SELECT COUNT(tax_id) 
FROM taxes
WHERE tax_id < (
    SELECT tax_id
    FROM taxes
    WHERE tax_id = $1
  )
ORDER BY tax_id DESC
LIMIT $2 + 1
`;

export const taxesHasNextPageQuery = /* sql */ `
SELECT COUNT(tax_id)
FROM taxes
WHERE tax_id > (
    SELECT tax_id
    FROM taxes
    WHERE tax_id = $1
  )
ORDER BY tax_id DESC
LIMIT $2 + 1
`;

export const taxQuery = /* sql */ `
SELECT tax_id as taxId,
  name,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
  FROM taxes WHERE tax_id = $1;
`;

export const createTaxMutation = /* sql */ `
INSERT INTO taxes (tax_id, name, rate) VALUES ($1, $2, $3);
`;

export const updateTaxMutation = /* sql */ `
UPDATE taxes
SET name = $1, rate = $2, updated_at = CURRENT_TIMESTAMP
WHERE tax_id = $3;
`;

export const deleteTaxMutation = /* sql */ `
DELETE FROM taxes
WHERE tax_id = $1;
`;
