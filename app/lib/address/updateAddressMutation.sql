UPDATE addresses
SET address1 = $1,
  address2 = $2,
  city = $3,
  country = $4,
  province = $5,
  zip = $6,
  updated_at = CURRENT_TIMESTAMP
WHERE address_id = $7