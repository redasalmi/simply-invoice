INSERT into invoice_services (
    invoice_service_id,
    service_id,
    invoice_id,
    quantity,
    tax_id
  )
VALUES ($1, $2, $3, $4, $5)