import { asc, count, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "~/db/config";
import { addressesTable, companiesTable } from "~/db/schema";
import { emptyResult, itemsPerPage } from "~/main/utils/pagination";
import type {
	Company,
	CreateAddressInput,
	CreateCompanyWithAddressInput,
	PaginatedResult,
	PaginationType,
	UpdateAddressInput,
	UpdateCompanyWithAddressInput,
} from "~/types";

async function getCompaniesCount() {
	return db.select({ count: count() }).from(companiesTable);
}

async function getPreviousCompaniesCount(cursor: string) {
	return db
		.select({ count: count() })
		.from(companiesTable)
		.where(gt(companiesTable.companyId, cursor));
}

async function getNextCompaniesCount(cursor: string) {
	return db
		.select({ count: count() })
		.from(companiesTable)
		.where(lt(companiesTable.companyId, cursor));
}

async function getPreviousCompanies(cursor: string | null) {
	const result = await db.query.companiesTable.findMany({
		where: cursor ? gt(companiesTable.companyId, cursor) : undefined,
		orderBy: [asc(companiesTable.companyId)],
		limit: itemsPerPage,
	});

	return result.reverse();
}

async function getNextCompanies(cursor: string | null) {
	return db.query.companiesTable.findMany({
		where: cursor ? lt(companiesTable.companyId, cursor) : undefined,
		orderBy: [desc(companiesTable.companyId)],
		limit: itemsPerPage,
	});
}

export async function getCompanies(
	cursor: string | null,
	paginationType: PaginationType | null,
) {
	const [companiesData, companiesTotal] = await Promise.all([
		paginationType === "previous"
			? getPreviousCompanies(cursor)
			: getNextCompanies(cursor),
		getCompaniesCount(),
	]);

	if (!companiesData.length) {
		return emptyResult as PaginatedResult<Company>;
	}

	const startCursor = companiesData[0].companyId;
	const endCursor = companiesData[companiesData.length - 1].companyId;

	const [previousCompaniesCount, nextCompaniesCount] = await Promise.all([
		getPreviousCompaniesCount(startCursor),
		getNextCompaniesCount(endCursor),
	]);

	return {
		items: companiesData,
		total: companiesTotal[0].count,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextCompaniesCount[0].count),
			hasPreviousPage: Boolean(previousCompaniesCount[0].count),
			startCursor,
		},
	};
}

export async function getCompany(companyId: string) {
	return db.query.companiesTable.findFirst({
		where: eq(companiesTable.companyId, companyId),
		with: {
			address: true,
		},
	});
}

export async function createCompanyWithAddress(
	company: CreateCompanyWithAddressInput,
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

		const [{ companyId }] = await tx
			.insert(companiesTable)
			.values({ ...company, addressId })
			.returning({ companyId: companiesTable.companyId });

		return {
			companyId,
			addressId,
		};
	});
}

export async function updateCompanyWithAddress(
	company: UpdateCompanyWithAddressInput,
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

		const [{ companyId }] = await tx
			.update(companiesTable)
			.set(company)
			.where(eq(companiesTable.companyId, company.companyId))
			.returning({ companyId: companiesTable.companyId });

		return {
			companyId,
			addressId,
		};
	});
}

export async function deleteCompany(companyId: string) {
	return db
		.delete(companiesTable)
		.where(eq(companiesTable.companyId, companyId));
}
