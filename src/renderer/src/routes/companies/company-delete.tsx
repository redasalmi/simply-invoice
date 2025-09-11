import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from 'react-router'
import invariant from 'tiny-invariant'
import * as Dialog from '~/renderer/components/ui/dialog'

export async function companyDeleteLoader({ params }: LoaderFunctionArgs) {
  const companyId = params.companyId
  invariant(companyId, 'Company ID is required')

  return {
    company: await window.api.db.companies.getById(companyId),
  }
}

export async function companyDeleteAction({ params }: ActionFunctionArgs) {
  const companyId = params.companyId
  invariant(companyId, 'Company ID is required')
  const result = await window.api.db.companies.delete(companyId)

  if ('errors' in result) {
    return {
      errors: result.errors,
    }
  }

  return redirect('/companies')
}

export function CompanyDeleteRoute() {
  const navigate = useNavigate()
  const params = useParams()
  const { company } = useLoaderData<typeof companyDeleteLoader>()
  const actionData = useActionData<typeof companyDeleteAction>()

  const navigation = useNavigation()
  const isLoading = navigation.state !== 'idle'
  const isSubmitting = navigation.state === 'submitting'

  const closeAlert = () => {
    navigate('/companies')
  }

  if (!company) {
    return (
      <Dialog.Root closeDialog={closeAlert} open role="alertdialog">
        <Dialog.Title>No Company Found!</Dialog.Title>
        <Dialog.Description>
          Sorry but no company with the ID: {params.companyId} was not found. Click the continue
          button to navigate back to your companies list.
        </Dialog.Description>
        <Dialog.ActionButton autoFocus onClick={closeAlert}>
          Continue
        </Dialog.ActionButton>
      </Dialog.Root>
    )
  }

  if (actionData?.errors) {
    return (
      <Dialog.Root closeDialog={closeAlert} open role="alertdialog">
        <Dialog.Title>Error Deleting Company!</Dialog.Title>
        <Dialog.Description>
          An error happened while deleting your company, please try again later.
        </Dialog.Description>
        <Dialog.ActionButton autoFocus onClick={closeAlert}>
          Continue
        </Dialog.ActionButton>
      </Dialog.Root>
    )
  }

  return (
    <Dialog.Root closeDialog={closeAlert} open role="alertdialog">
      <Dialog.Title>Are you absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete the {company.name} company.
      </Dialog.Description>
      <div className="flex justify-end gap-2">
        <Dialog.CancelButton autoFocus onClick={closeAlert}>
          Cancel
        </Dialog.CancelButton>
        <Form method="POST">
          <Dialog.ActionButton disabled={isSubmitting} type="submit">
            {isLoading ? '...Deleting' : 'Delete'}
          </Dialog.ActionButton>
        </Form>
      </div>
    </Dialog.Root>
  )
}
