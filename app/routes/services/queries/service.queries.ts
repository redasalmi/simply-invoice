import allServicesQuery from '~/routes/services/queries/allServicesQuery.sql?raw';
import servicesCountQuery from '~/routes/services/queries/servicesCountQuery.sql?raw';
import servicesHasNextPageQuery from '~/routes/services/queries/servicesHasNextPageQuery.sql?raw';
import servicesHasPreviousPageQuery from '~/routes/services/queries/servicesHasPreviousPageQuery.sql?raw';
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

async function hasPreviousServicesPage(startCursor: string) {
	const hasPreviousServicesCount = await window.db.select<ServicesCountResult>(
		servicesHasPreviousPageQuery,
		[startCursor, itemsPerPage],
	);

	return Boolean(hasPreviousServicesCount[0]['COUNT(service_id)']);
}

async function hasNextServicesPage(endCursor: string) {
	const hasNextServicesCount = await window.db.select<ServicesCountResult>(
		servicesHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextServicesCount[0]['COUNT(service_id)']);
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

	const [hasPreviousPage, hasNextPage] = await Promise.all([
		hasPreviousServicesPage(startCursor),
		hasNextServicesPage(endCursor),
	]);

	return {
		items: servicesData,
		total: servicesTotal,
		pageInfo: {
			endCursor,
			hasNextPage,
			hasPreviousPage,
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
