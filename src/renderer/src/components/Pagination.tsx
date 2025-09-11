import { Form, useNavigation } from 'react-router'
import { Button } from '~/renderer/components/ui/button'
import {
  cursorParam,
  paginationTypeParam,
  paginationTypes,
} from '~/renderer/utils/getPaginationParams'
import type { PageInfo } from '~/types'

interface PaginationProps {
  baseUrl: string
  pageInfo: PageInfo
}

export function Pagination({ baseUrl, pageInfo }: PaginationProps) {
  const navigation = useNavigation()
  const isSubmitting = navigation.state !== 'idle'

  return (
    <div className="mt-8 flex items-center justify-end gap-4">
      <Form action={baseUrl} method="get">
        <input name={cursorParam} type="hidden" value={pageInfo.startCursor} />
        <input name={paginationTypeParam} type="hidden" value={paginationTypes.previous} />
        <Button disabled={isSubmitting || !pageInfo.hasPreviousPage} type="submit">
          Previous
        </Button>
      </Form>
      <Form action={baseUrl} method="get">
        <input name={cursorParam} type="hidden" value={pageInfo.endCursor} />
        <input name={paginationTypeParam} type="hidden" value={paginationTypes.next} />
        <Button disabled={isSubmitting || !pageInfo.hasNextPage} type="submit">
          Next
        </Button>
      </Form>
    </div>
  )
}
