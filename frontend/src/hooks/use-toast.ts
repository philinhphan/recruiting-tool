import * as React from "react"

interface ToasterToast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: 'default' | 'destructive'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface State {
  toasts: ToasterToast[]
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(toasts: ToasterToast[]) {
  memoryState = { toasts }
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) => {
    const newToasts = memoryState.toasts.map((t) =>
      t.id === id ? { ...t, ...props } : t
    )
    dispatch(newToasts)
  }

  const dismiss = () => {
    const newToasts = memoryState.toasts.filter((t) => t.id !== id)
    dispatch(newToasts)
  }

  const newToast: ToasterToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss()
    },
  }

  dispatch([...memoryState.toasts, newToast])

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        const newToasts = memoryState.toasts.filter((t) => t.id !== toastId)
        dispatch(newToasts)
      } else {
        dispatch([])
      }
    },
  }
}

export { useToast, toast } 