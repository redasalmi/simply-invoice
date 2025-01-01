import * as sql from '~/sql/services/services.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Service, PaginatedResult } from '~/types';

type ServicesCountResult = [
	{
		'COUNT(service_id)': number;
	},
];

async function getServicesCount() {
	const servicesCount = await window.db.select<ServicesCountResult>(
		sql.servicesCountQuery,
	);

	return servicesCount[0]['COUNT(service_id)'];
}

export async function getAllServices() {
	return window.db.select<Array<Pick<Service, 'serviceId' | 'name'>>>(
		sql.allServicesQuery,
	);
}

async function getPaginatedServices(startCursor: string = '') {
	return window.db.select<Array<Service>>(sql.servicesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function hasPreviousServicesPage(startCursor: string = '') {
	const hasPreviousServicesCount = await window.db.select<ServicesCountResult>(
		sql.servicesHasPreviousPageQuery,
		[startCursor, itemsPerPage],
	);

	return Boolean(hasPreviousServicesCount[0]['COUNT(service_id)']);
}

async function hasNextServicesPage(endCursor: string) {
	const hasNextServicesCount = await window.db.select<ServicesCountResult>(
		sql.servicesHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextServicesCount[0]['COUNT(service_id)']);
}

export async function getServices(
	startCursor: string = '',
): Promise<PaginatedResult<Service>> {
	const [servicesData, servicesTotal] = await Promise.all([
		getPaginatedServices(startCursor),
		getServicesCount(),
	]);

	if (!servicesData.length) {
		return emptyResult as PaginatedResult<Service>;
	}

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
	const servicesData = await window.db.select<Array<Service>>(
		sql.serviceQuery,
		[serviceId],
	);

	if (!servicesData.length) {
		return undefined;
	}

	return servicesData[0];
}

type CreateServiceInput = Omit<Service, 'createdAt' | 'updatedAt'>;

export async function createService(service: CreateServiceInput) {
	return window.db.execute(sql.createServiceMutation, [
		service.serviceId,
		service.name,
		service.description,
		service.rate,
	]);
}

type UpdateServiceInput = Omit<Service, 'createdAt' | 'updatedAt'>;

export async function updateService(service: UpdateServiceInput) {
	return window.db.execute(sql.updateServiceMutation, [
		service.name,
		service.description,
		service.rate,
		service.serviceId,
	]);
}

export async function deleteService(serviceId: string) {
	return window.db.execute(sql.deleteServiceMutation, [serviceId]);
}
