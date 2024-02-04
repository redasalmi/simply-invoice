import localforage from 'localforage';

export const invoicesStore = localforage.createInstance({
	name: 'invoices',
});

export const companiesStore = localforage.createInstance({
	name: 'companies',
});

export const customersStore = localforage.createInstance({
	name: 'customers',
});

export async function getAllItems<T>(store: LocalForage): Promise<Array<T>> {
	const items: Array<T> = [];
	await store.iterate((item: T) => {
		items.push(item);
	});

	return items;
}
