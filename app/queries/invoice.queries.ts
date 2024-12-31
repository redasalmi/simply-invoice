import * as sql from '~/sql/invoices.sql';

type LastIncrementalInvoiceIdResult = [
	{
		'MAX(identifier)': number;
	},
];

export async function getLastIncrementalInvoiceId() {
	const lastIdResult = await window.db.select<LastIncrementalInvoiceIdResult>(
		sql.lastIncrementalInvoiceIdQuery,
	);

	return lastIdResult[0]['MAX(identifier)'] || 0;
}
