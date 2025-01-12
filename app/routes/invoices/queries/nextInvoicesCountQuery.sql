SELECT COUNT(invoice_id)
FROM invoices
WHERE invoice_id < (
    SELECT invoice_id
    FROM invoices
    WHERE invoice_id = $1
  )
ORDER BY invoice_id DESC
LIMIT $2 + 1