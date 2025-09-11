import { Link, type LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router'
import invariant from 'tiny-invariant'
import * as Dialog from '~/renderer/components/ui/dialog'
import * as Table from '~/renderer/components/ui/table'

export async function serviceDetailLoader({ params }: LoaderFunctionArgs) {
  const serviceId = params.serviceId
  invariant(serviceId, 'Service ID is required')

  return {
    service: await window.api.db.services.getById(serviceId),
  }
}

export function ServiceDetailRoute() {
  const navigate = useNavigate()
  const { service } = useLoaderData<typeof serviceDetailLoader>()

  const closeDialog = () => {
    navigate('/services')
  }

  return (
    <Dialog.Root closeDialog={closeDialog} open>
      <Dialog.CloseButton autoFocus onClick={closeDialog} />

      {!service ? (
        <>
          <Dialog.Title>No service found!</Dialog.Title>
          <Dialog.Description>
            <p>
              Sorry, but no service with this ID was found! Please click{' '}
              <Link aria-label="services list" className="hover:underline" to="/services">
                Here
              </Link>
            </p>
          </Dialog.Description>
        </>
      ) : (
        <>
          <Dialog.Title>Service details</Dialog.Title>
          <Dialog.Description>
            <Table.Root>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Name:</Table.Cell>
                  <Table.Cell>{service.name}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Rate:</Table.Cell>
                  <Table.Cell>{service.rate}%</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Dialog.Description>
        </>
      )}
    </Dialog.Root>
  )
}
