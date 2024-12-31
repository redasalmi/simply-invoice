export const lastIncrementalInvoiceIdQuery = /* sql */ `
SELECT MAX(identifier) FROM invoices
WHERE identifier_type = 'incremental';
`;
