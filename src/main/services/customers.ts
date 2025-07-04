import { asc, count, desc, eq, gt, lt } from "drizzle-orm";
import { ipcMain } from "electron";
import * as v from "valibot";
import { db } from "~/db/config";
import { addressesTable, customersTable } from "~/db/schema";
import {
	addressCreateSchema,
	addressUpdateSchema,
	customerCreateWithAddressSchema,
	customerDeleteSchema,
	customerUpdateWithAddressSchema,
} from "~/db/validation";
import { emptyResult, itemsPerPage } from "~/main/utils/pagination";
import type {
	AddressCreateFlatErrors,
	AddressUpdateFlatErrors,
	CreateAddressInput,
	CreateCustomerWithAddressInput,
	Customer,
	CustomerCreateWithAddressFlatErrors,
	CustomerUpdateWithAddressFlatErrors,
	PaginatedResult,
	PaginationType,
	UpdateAddressInput,
	UpdateCustomerWithAddressInput,
} from "~/types";

async function getCustomersCount() {
	return db.select({ count: count() }).from(customersTable);
}

async function getPreviousCustomersCount(cursor: string) {
	return db
		.select({ count: count() })
		.from(customersTable)
		.where(gt(customersTable.customerId, cursor));
}

async function getNextCustomersCount(cursor: string) {
	return db
		.select({ count: count() })
		.from(customersTable)
		.where(lt(customersTable.customerId, cursor));
}

async function getPreviousCustomers(cursor: string | null) {
	const result = await db.query.customersTable.findMany({
		where: cursor ? gt(customersTable.customerId, cursor) : undefined,
		orderBy: [asc(customersTable.customerId)],
		limit: itemsPerPage,
	});

	return result.reverse();
}

async function getNextCustomers(cursor: string | null) {
	return db.query.customersTable.findMany({
		where: cursor ? lt(customersTable.customerId, cursor) : undefined,
		orderBy: [desc(customersTable.customerId)],
		limit: itemsPerPage,
	});
}

export async function getCustomers(
	cursor: string | null,
	paginationType: PaginationType | null,
) {
	const [customersData, customersTotal] = await Promise.all([
		paginationType === "previous"
			? getPreviousCustomers(cursor)
			: getNextCustomers(cursor),
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

	return {
		items: customersData,
		total: customersTotal[0].count,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextCustomersCount[0].count),
			hasPreviousPage: Boolean(previousCustomersCount[0].count),
			startCursor,
		},
	};
}

export async function getCustomer(customerId: string) {
	return db.query.customersTable.findFirst({
		where: eq(customersTable.customerId, customerId),
		with: {
			address: true,
		},
	});
}

export async function createCustomerWithAddress(
	customer: CreateCustomerWithAddressInput,
	address: CreateAddressInput,
) {
	return db.transaction(async (tx) => {
		const [{ addressId }] = await tx
			.insert(addressesTable)
			.values(address)
			.returning({ addressId: addressesTable.addressId });

		if (!addressId) {
			throw new Error("Failed to create address");
		}

		const [{ customerId }] = await tx
			.insert(customersTable)
			.values({ ...customer, addressId })
			.returning({ customerId: customersTable.customerId });

		return {
			customerId,
			addressId,
		};
	});
}

export async function updateCustomerWithAddress(
	customer: UpdateCustomerWithAddressInput,
	address: UpdateAddressInput,
) {
	return db.transaction(async (tx) => {
		const [{ addressId }] = await tx
			.update(addressesTable)
			.set(address)
			.where(eq(addressesTable.addressId, address.addressId))
			.returning({ addressId: addressesTable.addressId });

		if (!addressId) {
			throw new Error("Failed to update address");
		}

		const [{ customerId }] = await tx
			.update(customersTable)
			.set(customer)
			.where(eq(customersTable.customerId, customer.customerId))
			.returning({ customerId: customersTable.customerId });

		return {
			customerId,
			addressId,
		};
	});
}

export async function deleteCustomer(customerId: string) {
	return db
		.delete(customersTable)
		.where(eq(customersTable.customerId, customerId));
}

export async function registerCustomersIcpHandles() {
	ipcMain.handle(
		"get-customers",
		(_, cursor: string | null, paginationType: PaginationType | null) => {
			return getCustomers(cursor, paginationType);
		},
	);

	ipcMain.handle("get-customer", (_, customerId: string) => {
		return getCustomer(customerId);
	});

	ipcMain.handle(
		"create-customer-with-address",
		(
			_,
			customer: CreateCustomerWithAddressInput,
			address: CreateAddressInput,
		) => {
			let customerErrors: CustomerCreateWithAddressFlatErrors | null = null;
			let addressErrors: AddressCreateFlatErrors | null = null;

			const parsedCustomer = v.safeParse(
				customerCreateWithAddressSchema,
				customer,
			);
			if (!parsedCustomer.success) {
				customerErrors = v.flatten(parsedCustomer.issues);
			}

			const parsedAddress = v.safeParse(addressCreateSchema, address);
			if (!parsedAddress.success) {
				addressErrors = v.flatten(parsedAddress.issues);
			}

			if (customerErrors || addressErrors) {
				return {
					errors: {
						customer: customerErrors,
						address: addressErrors,
					},
				};
			}

			return createCustomerWithAddress(
				parsedCustomer.output as CreateCustomerWithAddressInput,
				parsedAddress.output as CreateAddressInput,
			);
		},
	);

	ipcMain.handle(
		"update-customer-with-address",
		(
			_,
			customer: UpdateCustomerWithAddressInput,
			address: UpdateAddressInput,
		) => {
			let customerErrors: CustomerUpdateWithAddressFlatErrors | null = null;
			let addressErrors: AddressUpdateFlatErrors | null = null;

			const parsedCustomer = v.safeParse(
				customerUpdateWithAddressSchema,
				customer,
			);
			if (!parsedCustomer.success) {
				customerErrors = v.flatten(parsedCustomer.issues);
			}

			const parsedAddress = v.safeParse(addressUpdateSchema, address);
			if (!parsedAddress.success) {
				addressErrors = v.flatten(parsedAddress.issues);
			}

			if (customerErrors || addressErrors) {
				return {
					errors: {
						customer: customerErrors,
						address: addressErrors,
					},
				};
			}

			return updateCustomerWithAddress(
				parsedCustomer.output as UpdateCustomerWithAddressInput,
				parsedAddress.output as UpdateAddressInput,
			);
		},
	);

	ipcMain.handle("delete-customer", (_, customerId: string) => {
		const parsedData = v.safeParse(customerDeleteSchema, customerId);
		if (!parsedData.success) {
			return {
				errors: v.flatten(parsedData.issues),
			};
		}

		return deleteCustomer(customerId);
	});
}
