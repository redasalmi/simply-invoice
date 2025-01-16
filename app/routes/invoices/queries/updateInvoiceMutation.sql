UPDATE invoices
SET identifier = $1,
  identifier_type = $2,
  locale = $3,
  currency_country_code = $4,
  date = $5,
  due_date = $6,
  company_id = $7,
  customer_id = $8,
  subtotal_amount = $9,
  total_amount = $10,
  note = $11,
  updated_at = CURRENT_TIMESTAMP
WHERE invoice_id = $12