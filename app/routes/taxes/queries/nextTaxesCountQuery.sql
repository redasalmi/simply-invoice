SELECT COUNT(tax_id)
FROM taxes
WHERE tax_id < (
    SELECT tax_id
    FROM taxes
    WHERE tax_id = $1
  )
ORDER BY tax_id DESC
LIMIT $2 + 1