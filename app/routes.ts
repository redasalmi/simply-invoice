import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
	index('./routes/home.tsx'),

	route('companies', './routes/companies/companies-list.tsx', [
		route('detail/:id', './routes/companies/company-detail.tsx'),
		route('delete/:id', './routes/companies/company-delete.tsx'),
	]),
	route('/companies/create', './routes/companies/company-create.tsx'),
	route('/companies/update/:id', './routes/companies/company-update.tsx'),

	route('customers', './routes/customers/customers-list.tsx', [
		route('detail/:id', './routes/customers/customer-detail.tsx'),
		route('delete/:id', './routes/customers/customer-delete.tsx'),
	]),
	route('/customers/create', './routes/customers/customer-create.tsx'),
	route('/customers/update/:id', './routes/customers/customer-update.tsx'),

	route('services', './routes/services/services-list.tsx', [
		route('detail/:id', './routes/services/service-detail.tsx'),
		route('delete/:id', './routes/services/service-delete.tsx'),
	]),
	route('/services/create', './routes/services/service-create.tsx'),
	route('/services/update/:id', './routes/services/service-update.tsx'),

	route('taxes', './routes/taxes/taxes-list.tsx', [
		route('detail/:id', './routes/taxes/tax-detail.tsx'),
		route('delete/:id', './routes/taxes/tax-delete.tsx'),
	]),
	route('/taxes/create', './routes/taxes/tax-create.tsx'),
	route('/taxes/update/:id', './routes/taxes/tax-update.tsx'),

	route('invoices', './routes/invoices/invoices-list.tsx'),
	route('/invoices/create', './routes/invoices/create/route.tsx'),
	// TODO: an invoice can be viewed before it has been saved to the DB, find a solution to this :p we'll use the /invoices/detail/:id and /invoices/download/:id routes when the invoice is in the DB
	// we'll render the component directly and pass it the invoice object when the invoice is not saved yet
	// /invoices/detail/:id => to view the invoice PDF :p
	// /invoices/download/:id => to download the invoice PDF => show a loader, while using the download component from react-pdf in the background to generate and download the PDF

	// route('/api/invoice-pdf', './routes/api/invoice-pdf.tsx'),
] satisfies RouteConfig;
