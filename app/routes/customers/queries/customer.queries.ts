import allCustomersQuery from '~/routes/customers/queries/allCustomersQuery.sql?raw';
import customersCountQuery from '~/routes/customers/queries/customersCountQuery.sql?raw';
import nextCustomersCountQuery from '~/routes/customers/queries/nextCustomersCountQuery.sql?raw';
import previousCustomersCountQuery from '~/routes/customers/queries/previousCustomersCountQuery.sql?raw';
import firstCustomersQuery from '~/routes/customers/queries/firstCustomersQuery.sql?raw';
import previousCustomersQuery from '~/routes/customers/queries/previousCustomersQuery.sql?raw';
import nextCustomersQuery from '~/routes/customers/queries/nextCustomersQuery.sql?raw';
import customerQuery from '~/routes/customers/queries/customerQuery.sql?raw';
import createCustomerMutation from '~/routes/customers/queries/createCustomerMutation.sql?raw';
import deleteCustomerMutation from '~/routes/customers/queries/deleteCustomerMutation.sql?raw';
import updateCustomerMutation from '~/routes/customers/queries/updateCustomerMutation.sql?raw';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type { Customer, DBCustomer, PaginatedResult } from '~/types';

interface CustomerSelectResult extends Omit<DBCustomer, 'addressId'> {
	address: string;
}

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
			address,
		} = customersData[index];

		customers.push({
			customerId,
			name: name,
			email: email,
			additionalInformation: additionalInformation
				? JSON.parse(additionalInformation)
				: undefined,
			address: JSON.parse(address),
			createdAt,
			updatedAt,
		});
	}

	return customers;
}

async function getCustomersCount() {
	const customersCount =
		await window.db.select<CustomersCountResult>(customersCountQuery);

	return customersCount[0]['COUNT(customer_id)'];
}

export async function getAllCustomers() {
	return window.db.select<Array<Pick<Customer, 'customerId' | 'name'>>>(
		allCustomersQuery,
	);
}

async function getPreviousCustomers(startCursor: string) {
	return window.db.select<Array<CustomerSelectResult>>(previousCustomersQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function getNextCustomers(endCursor: string) {
	return window.db.select<Array<CustomerSelectResult>>(nextCustomersQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstCustomers() {
	return window.db.select<Array<CustomerSelectResult>>(firstCustomersQuery, [
		itemsPerPage,
	]);
}

async function getPreviousCustomersCount(startCursor: string) {
	const previousCustomersCount = await window.db.select<CustomersCountResult>(
		previousCustomersCountQuery,
		[startCursor, itemsPerPage],
	);

	return previousCustomersCount[0]['COUNT(customer_id)'];
}

async function getNextCustomersCount(endCursor: string) {
	const nextCustomersCount = await window.db.select<CustomersCountResult>(
		nextCustomersCountQuery,
		[endCursor, itemsPerPage],
	);

	return nextCustomersCount[0]['COUNT(customer_id)'];
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

	const [previousCustomersCount, nextCustomersCount] = await Promise.all([
		getPreviousCustomersCount(startCursor),
		getNextCustomersCount(endCursor),
	]);

	const customers = parseCustomersSelectResult(customersData);

	return {
		items: customers,
		total: customersTotal,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextCustomersCount),
			hasPreviousPage: Boolean(previousCustomersCount),
			startCursor,
		},
	};
}

export async function getCustomer(customerId: string) {
	const customersData = await window.db.select<Array<CustomerSelectResult>>(
		customerQuery,
		[customerId],
	);

	if (!customersData.length) {
		return undefined;
	}

	const customers = parseCustomersSelectResult(customersData);

	return customers[0];
}

type CreateCustomerInput = Omit<DBCustomer, 'createdAt' | 'updatedAt'>;

export async function createCustomer(customer: CreateCustomerInput) {
	return window.db.execute(createCustomerMutation, [
		customer.customerId,
		customer.name,
		customer.email,
		customer.addressId,
		customer.additionalInformation,
	]);
}

type UpdateCustomerInput = Omit<
	DBCustomer,
	'addressId' | 'createdAt' | 'updatedAt'
>;

export async function updateCustomer(customer: UpdateCustomerInput) {
	return window.db.execute(updateCustomerMutation, [
		customer.name,
		customer.email,
		customer.additionalInformation,
		customer.customerId,
	]);
}

export async function deleteCustomer(customerId: string) {
	return window.db.execute(deleteCustomerMutation, [customerId]);
}
