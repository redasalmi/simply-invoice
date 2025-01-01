INSERT INTO customers (
    customer_id,
    name,
    email,
    address_id,
    additional_information
  )
VALUES ($1, $2, $3, $4, JSON_INSERT($5))