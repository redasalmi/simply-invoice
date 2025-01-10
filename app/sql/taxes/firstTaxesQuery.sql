SELECT tax_id as taxId,
  name,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
FROM taxes
ORDER BY tax_id DESC
LIMIT $1