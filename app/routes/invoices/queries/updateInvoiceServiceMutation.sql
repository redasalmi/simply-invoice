UPDATE invoice_services
SET service_id = $1,
  quantity = $2,
  tax_id = $3,
  updated_at = CURRENT_TIMESTAMP
WHERE invoice_service_id = $4