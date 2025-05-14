"use client"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toasts() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex items-start gap-3 animate-in fade-in slide-in-from-right-5 ${
            toast.variant === "destructive"
              ? "bg-red-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          }`}
        >
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
