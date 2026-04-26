import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

type Props = { product: Product; compact?: boolean }

export function ProductCard({ product, compact }: Props) {
  const { add } = useCart()
  const [msg, setMsg] = useState(false)

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setMsg(true)
    window.setTimeout(() => setMsg(false), 1600)
  }

  return (
    <Link
      to={`/produs/${product.slug}`}
      className={`group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--accent)]/50 hover:shadow-lg hover:shadow-[var(--accent)]/5 ${
        compact ? '' : 'flex flex-col'
      }`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-[var(--elevated)] ${
          compact ? 'max-h-40' : ''
        }`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--muted)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <p className="text-right text-lg font-semibold text-white">
            {formatRon(product.price_ron)}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-medium leading-tight text-[var(--fg)] line-clamp-2">
          {product.name}
        </h3>
        {!compact && product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          {compact && (
            <p className="text-sm font-semibold text-[var(--accent)]">
              {formatRon(product.price_ron)}
            </p>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Adaugă
          </button>
        </div>
        {msg && (
          <p className="text-center text-xs text-[var(--accent)]">
            Adăugat în coș
          </p>
        )}
      </div>
    </Link>
  )
}

function formatRon(n: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0,
  }).format(n)
}
