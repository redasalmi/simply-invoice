export const createAddressQuery = /* sql */ `
INSERT INTO addresses (address_id, address1, address2, city, country, province, zip) VALUES ($1, $2, $3, $4, $5, $6, $7);
`;
