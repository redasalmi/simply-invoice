import { cn } from '~/renderer/utils/cn'

export interface LabelProps extends React.ComponentPropsWithRef<'label'> {}

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn('font-medium text-sm', className)} {...props} />
}
