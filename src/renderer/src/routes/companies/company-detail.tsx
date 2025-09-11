import { Link, type LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router'
import invariant from 'tiny-invariant'
import * as Dialog from '~/renderer/components/ui/dialog'
import * as Table from '~/renderer/components/ui/table'

export async function companyDetailLoader({ params }: LoaderFunctionArgs) {
  const companyId = params.companyId
  invariant(companyId, 'Company ID is required')

  return {
    company: await window.api.db.companies.getById(companyId),
  }
}

export function CompanyDetailRoute() {
  const navigate = useNavigate()
  const { company } = useLoaderData<typeof companyDetailLoader>()

  const closeDialog = () => {
    navigate('/companies')
  }

  return (
    <Dialog.Root closeDialog={closeDialog} open>
      <Dialog.CloseButton autoFocus onClick={closeDialog} />

      {!company ? (
        <>
          <Dialog.Title>No company found!</Dialog.Title>
          <Dialog.Description>
            <p>
              Sorry, but no company with this ID was found! Please click{' '}
              <Link aria-label="companies list" className="hover:underline" to="/companies">
                Here
              </Link>
            </p>
          </Dialog.Description>
        </>
      ) : (
        <>
          <Dialog.Title>Company details</Dialog.Title>
          <Dialog.Description>
            <Table.Root>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Name:</Table.Cell>
                  <Table.Cell>{company.name}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Email:</Table.Cell>
                  <Table.Cell>{company.email}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Address 1:</Table.Cell>
                  <Table.Cell>{company.address.address1}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Address 2:</Table.Cell>
                  <Table.Cell>{company.address.address2}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>City:</Table.Cell>
                  <Table.Cell>{company.address.city}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Country:</Table.Cell>
                  <Table.Cell>{company.address.country}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Province:</Table.Cell>
                  <Table.Cell>{company.address.province}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Zip:</Table.Cell>
                  <Table.Cell>{company.address.zip}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Dialog.Description>
        </>
      )}
    </Dialog.Root>
  )
}
