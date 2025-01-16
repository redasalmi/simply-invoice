SELECT i.invoice_id as invoiceId,
  i.identifier,
  i.identifier_type as identifierType,
  i.locale,
  i.currency_country_code as currencyCountryCode,
  i.date,
  i.due_date as dueDate,
  i.company_id as companyId,
  i.customer_id as customerId,
  i.note,
  json_group_array (
    json_object(
      'invoiceServiceId',
      invoice_service_id,
      'serviceId',
      service_id,
      'quantity',
      quantity,
      'taxId',
      tax_id
    )
  ) services
FROM invoices as i
  LEFT JOIN invoice_services as s ON s.invoice_id = i.invoice_id
WHERE i.invoice_id = $1