import { XIcon } from 'lucide-react'
import { createContext, use, useRef } from 'react'
import { Button, type ButtonProps } from '~/renderer/components/ui/button'
import { cn } from '~/renderer/utils/cn'

const DialogContext = createContext<{
  dialogRef: React.RefObject<HTMLDialogElement | null>
} | null>(null)

function useDialog() {
  const context = use(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a Dialog')
  }

  return context
}

export function Title({ className, ...props }: React.ComponentPropsWithRef<'h2'>) {
  return <h2 className={cn('m-0 font-medium text-[17px] text-mauve-12', className)} {...props} />
}

export function Description({ className, ...props }: React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('mt-[10px] mb-5 text-[15px] text-mauve-11 leading-normal', className)}
      {...props}
    />
  )
}

interface CloseButtonProps {
  autoFocus?: boolean
  onClick?: (ref: React.RefObject<HTMLDialogElement | null>) => void
}

export function CloseButton({ autoFocus, onClick }: CloseButtonProps) {
  const { dialogRef } = useDialog()

  const handleClick = () => {
    if (onClick) {
      onClick(dialogRef)

      return
    }

    dialogRef.current?.close()
  }

  return (
    <Button
      autoFocus={autoFocus}
      className="absolute top-2 right-2 size-8"
      onClick={handleClick}
      variant="icon"
    >
      <XIcon className="h-4 w-4" />
    </Button>
  )
}

interface CancelButtonProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  onClick?: (ref: React.RefObject<HTMLDialogElement | null>) => void
}

export function CancelButton({ onClick, ...props }: CancelButtonProps) {
  const { dialogRef } = useDialog()

  const handleClick = () => {
    if (onClick) {
      onClick(dialogRef)

      return
    }

    dialogRef.current?.close()
  }

  return <Button onClick={handleClick} variant="alternative" {...props} />
}

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {}

export function ActionButton(props: ActionButtonProps) {
  return <Button variant="danger" {...props} />
}

interface RootProps extends Omit<React.ComponentPropsWithRef<'dialog'>, 'ref'> {
  closeDialog?: (ref: React.RefObject<HTMLDialogElement | null>) => void
}

export function Root({ className, children, closeDialog, ...props }: RootProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Escape') {
      return
    }

    if (closeDialog) {
      closeDialog(dialogRef)

      return
    }

    dialogRef.current?.close()
  }

  const handleClickOutside = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) {
      return
    }

    if (closeDialog) {
      closeDialog(dialogRef)

      return
    }

    dialogRef.current?.close()
  }

  return (
    <dialog
      className={cn(
        'fixed inset-0 z-50 flex size-full items-center justify-center bg-transparent backdrop-brightness-50',
        className
      )}
      onClick={handleClickOutside}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      {...props}
    >
      <DialogContext.Provider value={{ dialogRef }}>
        <div className="relative rounded-lg bg-white p-8">{children}</div>
      </DialogContext.Provider>
    </dialog>
  )
}
