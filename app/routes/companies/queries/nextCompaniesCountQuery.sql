SELECT COUNT(company_id)
FROM companies
WHERE company_id > (
    SELECT company_id
    FROM companies
    WHERE company_id = $1
  )
ORDER BY company_id DESC
LIMIT $2 + 1