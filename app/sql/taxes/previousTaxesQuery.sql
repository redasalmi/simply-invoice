SELECT tax_id as taxId,
  name,
  rate,
  created_at as createdAt,
  updated_at as updatedAt
FROM (
    SELECT tax_id,
      name,
      rate,
      created_at,
      updated_at
    FROM taxes
    WHERE tax_id > $1
    ORDER BY tax_id ASC
    LIMIT $2
  )
ORDER BY tax_id DESC