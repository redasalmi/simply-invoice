import allServicesQuery from '~/routes/services/queries/allServicesQuery.sql?raw';
import servicesCountQuery from '~/routes/services/queries/servicesCountQuery.sql?raw';
import nextServicesCountQuery from '~/routes/services/queries/nextServicesCountQuery.sql?raw';
import previousServicesCountQuery from '~/routes/services/queries/previousServicesCountQuery.sql?raw';
import firstServicesQuery from '~/routes/services/queries/firstServicesQuery.sql?raw';
import previousServicesQuery from '~/routes/services/queries/previousServicesQuery.sql?raw';
import nextServicesQuery from '~/routes/services/queries/nextServicesQuery.sql?raw';
import serviceQuery from '~/routes/services/queries/serviceQuery.sql?raw';
import createServiceMutation from '~/routes/services/queries/createServiceMutation.sql?raw';
import deleteServiceMutation from '~/routes/services/queries/deleteServiceMutation.sql?raw';
import updateServiceMutation from '~/routes/services/queries/updateServiceMutation.sql?raw';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type { Service, PaginatedResult } from '~/types';

type ServicesCountResult = [
	{
		'COUNT(service_id)': number;
	},
];

async function getServicesCount() {
	const servicesCount =
		await window.db.select<ServicesCountResult>(servicesCountQuery);

	return servicesCount[0]['COUNT(service_id)'];
}

export async function getAllServices() {
	return window.db.select<Array<Pick<Service, 'serviceId' | 'name' | 'rate'>>>(
		allServicesQuery,
	);
}

async function getPreviousServices(startCursor: string) {
	return window.db.select<Array<Service>>(previousServicesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function getNextServices(endCursor: string) {
	return window.db.select<Array<Service>>(nextServicesQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstServices() {
	return window.db.select<Array<Service>>(firstServicesQuery, [itemsPerPage]);
}

async function getPreviousServicesCount(startCursor: string) {
	const previousServicesCount = await window.db.select<ServicesCountResult>(
		previousServicesCountQuery,
		[startCursor, itemsPerPage],
	);

	return previousServicesCount[0]['COUNT(service_id)'];
}

async function getNextServicesCount(endCursor: string) {
	const nextServicesCount = await window.db.select<ServicesCountResult>(
		nextServicesCountQuery,
		[endCursor, itemsPerPage],
	);

	return nextServicesCount[0]['COUNT(service_id)'];
}

export async function getServices(
	cursor: string | null,
	paginationType: PaginationType | null,
): Promise<PaginatedResult<Service>> {
	const [servicesData, servicesTotal] = await Promise.all([
		cursor && paginationType
			? paginationType === 'previous'
				? getPreviousServices(cursor)
				: getNextServices(cursor)
			: getFirstServices(),
		getServicesCount(),
	]);

	if (!servicesData.length) {
		return emptyResult as PaginatedResult<Service>;
	}

	const startCursor = servicesData[0].serviceId;
	const endCursor = servicesData[servicesData.length - 1].serviceId;

	const [previousServicesCount, nextServicesCount] = await Promise.all([
		getPreviousServicesCount(startCursor),
		getNextServicesCount(endCursor),
	]);

	return {
		items: servicesData,
		total: servicesTotal,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextServicesCount),
			hasPreviousPage: Boolean(previousServicesCount),
			startCursor,
		},
	};
}

export async function getService(serviceId: string) {
	const servicesData = await window.db.select<Array<Service>>(serviceQuery, [
		serviceId,
	]);

	if (!servicesData.length) {
		return undefined;
	}

	return servicesData[0];
}

type CreateServiceInput = Omit<Service, 'createdAt' | 'updatedAt'>;

export async function createService(service: CreateServiceInput) {
	return window.db.execute(createServiceMutation, [
		service.serviceId,
		service.name,
		service.description,
		service.rate,
	]);
}

type UpdateServiceInput = Omit<Service, 'createdAt' | 'updatedAt'>;

export async function updateService(service: UpdateServiceInput) {
	return window.db.execute(updateServiceMutation, [
		service.name,
		service.description,
		service.rate,
		service.serviceId,
	]);
}

export async function deleteService(serviceId: string) {
	return window.db.execute(deleteServiceMutation, [serviceId]);
}
