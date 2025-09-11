import { useEffect } from 'react'
import type { BaseIssue, BaseSchema, FlatErrors } from 'valibot'

export function useFormActionErrorFocus<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  formRef: React.RefObject<HTMLFormElement | null>,
  actionData: { errors: FlatErrors<T> | Record<string, FlatErrors<T>> } | undefined
) {
  useEffect(() => {
    if (!formRef.current || !actionData?.errors) {
      return
    }

    const input: HTMLInputElement | null = formRef.current.querySelector(
      'input[aria-invalid="true"]'
    )
    if (!input) {
      return
    }

    input.focus()
  }, [formRef, actionData?.errors])
}
