SELECT tax_id as taxId,
  name,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
FROM taxes
WHERE tax_id = $1