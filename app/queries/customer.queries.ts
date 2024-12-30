import * as sql from '~/sql/customers.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Address, Customer, PaginatedResult } from '~/types';

type CustomersSelectResult = Array<
	Omit<Customer, 'address' | 'additionalInformation'> &
		Address & {
			additionalInformation: string | null;
		}
>;

type CustomersCountResult = [
	{
		'COUNT(customer_id)': number;
	},
];

function parseCustomersSelectResult(customersData: CustomersSelectResult) {
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

export async function getCustomers(
	startCursor: string = '',
): Promise<PaginatedResult<Customer>> {
	const [customersData, customersCount] = await Promise.all([
		window.db.select<CustomersSelectResult>(sql.customersQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CustomersCountResult>(sql.customersCountQuery),
	]);

	if (!customersData.length) {
		return emptyResult as PaginatedResult<Customer>;
	}

	const endCursor = customersData[customersData.length - 1].customerId;

	const [hasPreviousCustomersCount, hasNextCustomersCount] = await Promise.all([
		window.db.select<CustomersCountResult>(sql.customersHasPreviousPageQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<CustomersCountResult>(sql.customersHasNextPageQuery, [
			endCursor,
			itemsPerPage,
		]),
	]);

	const customers = parseCustomersSelectResult(customersData);

	const total = customersCount[0]['COUNT(customer_id)'];
	const hasNextPage = Boolean(hasNextCustomersCount[0]['COUNT(customer_id)']);
	const hasPreviousPage = Boolean(
		hasPreviousCustomersCount[0]['COUNT(customer_id)'],
	);

	return {
		items: customers,
		total,
		pageInfo: {
			endCursor,
			hasNextPage,
			hasPreviousPage,
			startCursor,
		},
	};
}

export async function getCustomer(customerId: string) {
	const customersData = await window.db.select<CustomersSelectResult>(
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
