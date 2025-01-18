SELECT i.invoice_id as invoiceId,
  i.identifier,
  i.currency_country_code as currencyCountryCode,
  i.date,
  json_object('totalAmount', i.total_amount) cost,
  json_object('email', c.email) customer
FROM invoices as i
  LEFT JOIN customers as c ON c.customer_id = i.customer_id
WHERE i.invoice_id < $1
ORDER BY i.invoice_id DESC
LIMIT $2