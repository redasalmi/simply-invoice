import {
  createBrowserRouter,
  unstable_createContext,
  type unstable_RouterContext,
  unstable_RouterContextProvider,
} from 'react-router'
import { Loading } from '~/renderer/loading'
import { RootRoute } from '~/renderer/root'
import { companiesRoutes } from '~/renderer/routes/companies/companies-routes'
import { customersRoutes } from '~/renderer/routes/customers/customers-routes'
import { DashboardRoute } from '~/renderer/routes/dashboard'
import { servicesRoutes } from '~/renderer/routes/services/services-routes'
import { taxesRoutes } from '~/renderer/routes/taxes/taxes-routes'
import type { UserSetting } from '~/types'

export const userSettingsContext =
  unstable_createContext<Map<UserSetting['settingKey'], UserSetting>>()

export const router = createBrowserRouter(
  [
    {
      Component: RootRoute,
      HydrateFallback: Loading,
      children: [
        {
          index: true,
          Component: DashboardRoute,
        },
        ...companiesRoutes,
        ...customersRoutes,
        ...servicesRoutes,
        ...taxesRoutes,
      ],
    },
  ],
  {
    unstable_getContext: async () => {
      const context = new unstable_RouterContextProvider()
      const userSettings = await window.api.db.userSettings.get()
      const userSettingsMap = new Map(
        userSettings.map((userSetting) => [userSetting.settingKey, userSetting])
      )
      context.set(userSettingsContext, userSettingsMap)

      return context
    },
  }
)

declare module 'react-router' {
  interface LoaderFunctionArgs {
    context: Map<unstable_RouterContext, Map<UserSetting['settingKey'], UserSetting>>
  }
}
