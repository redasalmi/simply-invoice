export const createAddressSql = /* sql */ `
INSERT INTO addresses (address_id, address1, address2, city, country, province, zip)
VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

export const updateAddressSql = /* sql */ `
UPDATE addresses
SET address1 = $1, address2 = $2, city = $3, country = $4, province = $5, zip = $6, updated_at = CURRENT_TIMESTAMP
WHERE address_id = $7;
`;
