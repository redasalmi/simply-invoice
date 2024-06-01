import type { Company } from '~/types/company.types';
import type { IdType, Locale } from '~/lib/constants';
import type { CountryCode } from '~/lib/currencies';
import type { Customer } from '~/types/customer.types';
import type { Service } from '~/types/service.types';

export type Invoice = {
	id: string;
	invoiceId: string;
	invoiceIdType: IdType;
	locale: Locale;
	countryCode: CountryCode;

	invoiceDate: string;
	dueDate: string;
	dateFormat: string;

	company: Omit<Company, 'createdAt' | 'updatedAt'>;
	customer: Omit<Customer, 'createdAt' | 'updatedAt'>;
	services: Array<
		Omit<Service, 'createdAt' | 'updatedAt'> & { quantity: number }
	>;
	note?: string;

	cost: {
		subtotalAmount: number;
		shipping: number;
		tax: number;
		totalAmount: number;
	};

	createdAt: string;
	updatedAt: string;
};
