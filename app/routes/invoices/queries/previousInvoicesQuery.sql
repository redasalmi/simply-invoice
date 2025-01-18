SELECT i.invoice_id as invoiceId,
  i.identifier,
  i.currency_country_code as currencyCountryCode,
  i.date,
  json_object('totalAmount', i.total_amount) cost,
  json_object('email', c.email) customer
FROM (
    SELECT i.invoice_id,
      i.identifier,
      i.currency_country_code,
      i.date,
      i.total_amount,
      i.customer_id
    FROM invoices as i
    WHERE i.invoice_id > $1
    ORDER BY i.invoice_id ASC
    LIMIT $2
  ) i
  LEFT JOIN customers as c ON c.customer_id = i.customer_id
ORDER BY invoice_id DESC