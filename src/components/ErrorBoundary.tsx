import { useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: (error: Error, reset: () => void) => React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason?.message || String(event.reason)))
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (error) {
    return (
      fallback?.(error, () => setError(null)) || (
        <DefaultErrorPage error={error} reset={() => setError(null)} />
      )
    )
  }

  return children
}

function DefaultErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-md w-full mx-auto px-6 py-12 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-[var(--color-muted-foreground)] mb-4">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <div className="bg-[var(--color-card-background)] rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-mono text-red-500 break-words">
            {error.message || 'Unknown error'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/'
            }}
            className="flex-1 bg-[var(--color-muted)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] font-semibold py-2 px-4 rounded transition-colors"
          >
            Go home
          </button>
        </div>

        <p className="text-xs text-[var(--color-muted-foreground)] mt-6">
          If the problem persists, please refresh the page or contact support.
        </p>
      </div>
    </div>
  )
}
