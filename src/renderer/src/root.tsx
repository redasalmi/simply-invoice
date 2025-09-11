import { Outlet } from 'react-router'
import { Sidebar } from '~/renderer/components/Sidebar'

export function RootRoute() {
  return (
    <div className="flex h-lvh">
      <Sidebar />
      <Outlet />
    </div>
  )
}
