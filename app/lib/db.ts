import Dexie, { type Table } from 'dexie';
import type { Company } from '~/types/company.types';
import type { Customer } from '~/types/customer.types';
import type { Invoice } from '~/types/invoice.types';
import type { Service } from '~/types/service.types';

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
			invoices: '++id, invoiceId, invoiceIdType', // TODO: add amount, currency and other properties for indexing and sorting invoices
		});
	}
}

export const db = new DexieDB();

function fastForward<T extends { id: string }>(
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

export async function getPage<T extends { id: string }>(
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
