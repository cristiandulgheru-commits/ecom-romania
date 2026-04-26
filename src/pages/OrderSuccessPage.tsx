import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export function OrderSuccessPage() {
  const [params] = useSearchParams()
  const id = params.get('id')

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
        Comandă plasată cu succes
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Îți trimitem un email de confirmare. {id && `Referință: ${id}`}
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-fg)]"
      >
        Înapoi acasă
      </Link>
    </div>
  )
}
