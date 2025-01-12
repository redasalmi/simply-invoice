SELECT i.invoice_id as invoiceId,
  i.identifier,
  i.currency_country_code as currencyCountryCode,
  i.date,
  i.total_amount as totalAmount,
  c.email as customerEmail
FROM invoices as i
  LEFT JOIN customers as c ON c.customer_id = i.customer_id
ORDER BY i.invoice_id DESC
LIMIT $1