import type { RouteObject } from 'react-router'
import { CompaniesListRoute, companiesListLoader } from '~/renderer/routes/companies/companies-list'
import { CompanyCreateRoute, companyCreateAction } from '~/renderer/routes/companies/company-create'
import {
  CompanyDeleteRoute,
  companyDeleteAction,
  companyDeleteLoader,
} from '~/renderer/routes/companies/company-delete'
import { CompanyDetailRoute, companyDetailLoader } from '~/renderer/routes/companies/company-detail'
import {
  CompanyUpdateRoute,
  companyUpdateAction,
  companyUpdateLoader,
} from '~/renderer/routes/companies/company-update'

export const companiesRoutes: Array<RouteObject> = [
  {
    path: '/companies',
    loader: companiesListLoader,
    Component: CompaniesListRoute,
    children: [
      {
        path: 'detail/:companyId',
        loader: companyDetailLoader,
        Component: CompanyDetailRoute,
      },
      {
        path: 'delete/:companyId',
        loader: companyDeleteLoader,
        action: companyDeleteAction,
        Component: CompanyDeleteRoute,
      },
    ],
  },
  {
    path: '/companies/create',
    action: companyCreateAction,
    Component: CompanyCreateRoute,
  },
  {
    path: '/companies/update/:companyId',
    loader: companyUpdateLoader,
    action: companyUpdateAction,
    Component: CompanyUpdateRoute,
  },
]
