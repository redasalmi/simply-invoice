import * as sql from '~/sql/services.sql';
import { itemsPerPage } from '~/lib/pagination';
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
		return {
			items: [],
			total: 0,
			pageInfo: {
				endCursor: '',
				hasNextPage: false,
				hasPreviousPage: false,
				startCursor: '',
			},
		};
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

type CreateServiceInput = Omit<Service, 'createdAt' | 'updatedAt'>;

export async function createService(service: CreateServiceInput) {
	return window.db.execute(sql.createServiceMutation, [
		service.serviceId,
		service.name,
		service.description,
		service.rate,
	]);
}
