import * as sql from '~/sql/customers/customers.sql';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type { Address, Customer, PaginatedResult } from '~/types';

type CustomerSelectResult = Omit<
	Customer,
	'address' | 'additionalInformation'
> &
	Address & {
		additionalInformation: string | null;
	};

type CustomersCountResult = [
	{
		'COUNT(customer_id)': number;
	},
];

function parseCustomersSelectResult(
	customersData: Array<CustomerSelectResult>,
) {
	const customers: Array<Customer> = [];

	for (let index = 0; index < customersData.length; index++) {
		const {
			customerId,
			name,
			email,
			additionalInformation,
			createdAt,
			updatedAt,
			addressId,
			address1,
			address2,
			city,
			country,
			province,
			zip,
		} = customersData[index];

		customers.push({
			customerId,
			name: name,
			email: email,
			additionalInformation: additionalInformation
				? JSON.parse(additionalInformation)
				: undefined,
			createdAt,
			updatedAt,
			address: {
				addressId,
				address1,
				address2,
				city,
				country,
				province,
				zip,
			},
		});
	}

	return customers;
}

async function getCustomersCount() {
	const customersCount = await window.db.select<CustomersCountResult>(
		sql.customersCountQuery,
	);

	return customersCount[0]['COUNT(customer_id)'];
}

export async function getAllCustomers() {
	return window.db.select<Array<Pick<Customer, 'customerId' | 'name'>>>(
		sql.allCustomersQuery,
	);
}

async function getPreviousCustomers(startCursor: string) {
	return window.db.select<Array<CustomerSelectResult>>(
		sql.previousCustomersQuery,
		[startCursor, itemsPerPage],
	);
}

async function getNextCustomers(endCursor: string) {
	return window.db.select<Array<CustomerSelectResult>>(sql.nextCustomersQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstCustomers() {
	return window.db.select<Array<CustomerSelectResult>>(
		sql.firstCustomersQuery,
		[itemsPerPage],
	);
}

async function hasPreviousCustomersPage(startCursor: string = '') {
	const hasPreviousCustomersCount =
		await window.db.select<CustomersCountResult>(
			sql.customersHasPreviousPageQuery,
			[startCursor, itemsPerPage],
		);

	return Boolean(hasPreviousCustomersCount[0]['COUNT(customer_id)']);
}

async function hasNextCustomersPage(endCursor: string) {
	const hasNextCustomersCount = await window.db.select<CustomersCountResult>(
		sql.customersHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextCustomersCount[0]['COUNT(customer_id)']);
}

export async function getCustomers(
	cursor: string | null,
	paginationType: PaginationType | null,
): Promise<PaginatedResult<Customer>> {
	const [customersData, customersTotal] = await Promise.all([
		cursor && paginationType
			? paginationType === 'previous'
				? getPreviousCustomers(cursor)
				: getNextCustomers(cursor)
			: getFirstCustomers(),
		getCustomersCount(),
	]);

	if (!customersData.length) {
		return emptyResult as PaginatedResult<Customer>;
	}

	const startCursor = customersData[0].customerId;
	const endCursor = customersData[customersData.length - 1].customerId;

	const [hasPreviousPage, hasNextPage] = await Promise.all([
		hasPreviousCustomersPage(startCursor),
		hasNextCustomersPage(endCursor),
	]);

	const customers = parseCustomersSelectResult(customersData);

	return {
		items: customers,
		total: customersTotal,
		pageInfo: {
			endCursor,
			hasNextPage,
			hasPreviousPage,
			startCursor,
		},
	};
}

export async function getCustomer(customerId: string) {
	const customersData = await window.db.select<Array<CustomerSelectResult>>(
		sql.customerQuery,
		[customerId],
	);

	if (!customersData.length) {
		return undefined;
	}

	const customers = parseCustomersSelectResult(customersData);

	return customers[0];
}

type CreateCustomerInput = Pick<Customer, 'customerId' | 'name' | 'email'> & {
	additionalInformation?: string;
	addressId: string;
};

export async function createCustomer(customer: CreateCustomerInput) {
	return window.db.execute(sql.createCustomerMutation, [
		customer.customerId,
		customer.name,
		customer.email,
		customer.addressId,
		customer.additionalInformation,
	]);
}

type UpdateCustomerInput = Pick<Customer, 'customerId' | 'name' | 'email'> & {
	additionalInformation?: string;
};

export async function updateCustomer(customer: UpdateCustomerInput) {
	return window.db.execute(sql.updateCustomerMutation, [
		customer.name,
		customer.email,
		customer.additionalInformation,
		customer.customerId,
	]);
}

export async function deleteCustomer(customerId: string) {
	return window.db.execute(sql.deleteCustomerMutation, [customerId]);
}
