import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export function CartPage() {
  const { lines, setQty, remove, subtotal, count } = useCart()

  if (count === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
          Coșul tău este gol
        </h1>
        <p className="mt-2 text-[var(--muted)]">Explorează categoriile noastre.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-fg)]"
        >
          Continuă cumpărăturile
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--fg)]">
        Coș de cumpărături
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((l) => (
            <div
              key={l.productId}
              className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--elevated)]">
                {l.imageUrl && (
                  <img
                    src={l.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--fg)]">{l.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  {formatRon(l.priceR)} / buc
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-[var(--border)]">
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => setQty(l.productId, l.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{l.quantity}</span>
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => setQty(l.productId, l.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => remove(l.productId)}
                    aria-label="Șterge"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="shrink-0 font-semibold text-[var(--fg)]">
                {formatRon(l.priceR * l.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Rezumat</h2>
          <div className="mt-4 flex justify-between text-sm text-[var(--muted)]">
            <span>Subtotal (TVA inclus)</span>
            <span className="font-medium text-[var(--fg)]">
              {formatRon(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Transport calculat la următorul pas. Livrare în România.
          </p>
          <Link
            to="/comanda"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[var(--accent)] py-3 text-center font-semibold text-[var(--accent-fg)]"
          >
            Finalizează comanda
          </Link>
          <Link
            to="/"
            className="mt-3 block w-full text-center text-sm text-[var(--muted)] hover:text-[var(--accent)]"
          >
            ← Continuă cumpărăturile
          </Link>
        </div>
      </div>
    </div>
  )
}

function formatRon(n: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
  }).format(n)
}
