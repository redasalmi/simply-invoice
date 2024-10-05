import { type RouteConfig, route, index } from '@react-router/dev/routes';

export const routes: RouteConfig = [
	index('./routes/home.tsx'),

	route('companies', './routes/companies/companies-list.tsx', [
		route('detail/:id', './routes/companies/company-detail.tsx'),
		route('delete/:id', './routes/companies/company-delete.tsx'),
	]),

	route('/companies/new', './routes/companies/company-create.tsx'),
	route('/companies/update/:id', './routes/companies/company-update.tsx'),
];
