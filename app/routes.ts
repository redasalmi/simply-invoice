import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
	index('./routes/home.tsx'),

	route('companies', './routes/companies/companies-list.tsx', [
		route('detail/:id', './routes/companies/company-detail.tsx'),
		route('delete/:id', './routes/companies/company-delete.tsx'),
	]),
	route('/companies/new', './routes/companies/company-create.tsx'),
	route('/companies/update/:id', './routes/companies/company-update.tsx'),

	route('customers', './routes/customers/customers-list.tsx', [
		route('detail/:id', './routes/customers/customer-detail.tsx'),
		route('delete/:id', './routes/customers/customer-delete.tsx'),
	]),
	route('/customers/new', './routes/customers/customer-create.tsx'),
	route('/customers/update/:id', './routes/customers/customer-update.tsx'),

	route('services', './routes/services/services-list.tsx', [
		// route('detail/:id', './routes/services/service-detail.tsx'),
		// route('delete/:id', './routes/services/service-delete.tsx'),
	]),
	route('/services/new', './routes/services/service-create.tsx'),
	// route('/services/update/:id', './routes/services/service-update.tsx'),

	// route('/invoices', './routes/invoices/invoices-list.tsx'),
	// route('/invoices/new', './routes/invoices/invoice-create.tsx'),

	// route('/api/invoice-pdf', './routes/api/invoice-pdf.tsx'),
] satisfies RouteConfig;
