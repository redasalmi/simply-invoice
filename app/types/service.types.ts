export type Service = {
	id: string;
	name: string;
	description?: string;
	rate: number;
	createdAt: string;
	updatedAt: string;
};

export type UpdateService = Omit<Service, 'createdAt'>;
