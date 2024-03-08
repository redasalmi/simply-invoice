import Dexie from 'dexie';
import type { Table } from 'dexie';

import type { Company, Customer, Invoice, Service } from '~/lib/types';

class DexieDB extends Dexie {
	companies!: Table<Company>;
	customers!: Table<Customer>;
	services!: Table<Service>;
	invoices!: Table<Invoice>;

	constructor() {
		super('SimplyInvoice');
		this.version(1).stores({
			companies: '++id, name, email, createdAt, updatedAt',
			customers: '++id, name, email, createdAt, updatedAt',
			services: '++id, name, rate, createdAt, updatedAt',
			invoices: '++id, invoiceId, invoiceIdType',
		});
	}
}

export const db = new DexieDB();

function fastForward<T>(
	lastItemID: string,
	filterCallback?: (item: T) => boolean,
) {
	let fastForwardComplete = false;

	return (item: T) => {
		if (fastForwardComplete) {
			return filterCallback ? filterCallback(item) : true;
		}

		if (item.id === lastItemID) {
			fastForwardComplete = true;
		}

		return false;
	};
}

const ITEMS_PER_PAGE = 10;

export async function getPage<T>(
	table: Table<T>,
	page: number,
	lastItemID?: string,
	filterCallback: (item: T) => boolean = () => true,
) {
	let items = null;
	const count = await table.count();

	if (!lastItemID) {
		items = await table
			.orderBy('id')
			.reverse()
			.filter(filterCallback)
			.limit(ITEMS_PER_PAGE)
			.toArray();
	} else {
		items = await table
			.where('id')
			.belowOrEqual(lastItemID)
			.reverse()
			.filter(fastForward(lastItemID, filterCallback))
			.limit(ITEMS_PER_PAGE)
			.toArray();
	}

	return {
		items,
		page,
		total: count,
		hasNextPage: page * ITEMS_PER_PAGE < count,
	};
}
