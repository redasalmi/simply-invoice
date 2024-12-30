import * as sql from '~/sql/services.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Service, PaginatedResult } from '~/types';

type ServicesCountResult = [
	{
		'COUNT(service_id)': number;
	},
];

export async function getServices(
	startCursor: string = '',
): Promise<PaginatedResult<Service>> {
	const [servicesData, servicesCount] = await Promise.all([
		window.db.select<Array<Service>>(sql.servicesQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<ServicesCountResult>(sql.servicesCountQuery),
	]);

	if (!servicesData.length) {
		return emptyResult as PaginatedResult<Service>;
	}

	const endCursor = servicesData[servicesData.length - 1].serviceId;

	const [hasPreviousServicesCount, hasNextServicesCount] = await Promise.all([
		window.db.select<ServicesCountResult>(sql.servicesHasPreviousPageQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<ServicesCountResult>(sql.servicesHasNextPageQuery, [
			endCursor,
			itemsPerPage,
		]),
	]);

	const total = servicesCount[0]['COUNT(service_id)'];
	const hasNextPage = Boolean(hasNextServicesCount[0]['COUNT(service_id)']);
	const hasPreviousPage = Boolean(
		hasPreviousServicesCount[0]['COUNT(service_id)'],
	);

	return {
		items: servicesData,
		total,
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
