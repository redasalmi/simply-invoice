import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Link, type LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router'
import { CreateLink } from '~/renderer/components/CreateLink'
import { Pagination } from '~/renderer/components/Pagination'
import * as Table from '~/renderer/components/ui/table'
import { userSettingsContext } from '~/renderer/routes'
import { getPaginationParams } from '~/renderer/utils/getPaginationParams'

export async function taxesListLoader({ request, context }: LoaderFunctionArgs) {
  const userSettings = context.get(userSettingsContext)
  const { cursor, paginationType, itemsPerPage } = getPaginationParams(
    request.url,
    userSettings?.get('taxes-table-items-per-page')
  )

  return {
    taxes: await window.api.db.taxes.get(cursor, paginationType, itemsPerPage),
  }
}

export function TaxesListRoute() {
  const { taxes } = useLoaderData<typeof taxesListLoader>()

  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          {taxes.total ? <p>Total taxes: {taxes.total}</p> : null}
          <CreateLink to="/taxes/create">Create Tax</CreateLink>
        </div>
        <div className="mt-6">
          {taxes && taxes.items.length > 0 ? (
            <>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>Rate (%)</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {taxes.items.map(({ taxId, name, rate }) => (
                    <Table.Row key={taxId}>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>{rate}</Table.Cell>
                      <Table.Cell className="flex items-center gap-4">
                        <Link aria-label={`view ${name} tax details`} to={`/taxes/detail/${taxId}`}>
                          <EyeIcon />
                        </Link>
                        <Link aria-label={`update ${name} tax`} to={`/taxes/update/${taxId}`}>
                          <PencilIcon />
                        </Link>
                        <Link aria-label={`delete ${name} tax`} to={`/taxes/delete/${taxId}`}>
                          <TrashIcon />
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              {taxes.total > taxes.itemsPerPage ? (
                <Pagination baseUrl="/taxes" pageInfo={taxes.pageInfo} />
              ) : null}
            </>
          ) : (
            <p>No Tax found.</p>
          )}
        </div>
      </section>
      <Outlet />
    </>
  )
}
