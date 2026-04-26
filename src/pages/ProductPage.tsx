import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { getProductBySlug } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { CATEGORY_LABELS } from '../types'
import type { Product } from '../types'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { add } = useCart()
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    let ok = true
    void getProductBySlug(slug).then((p) => {
      if (ok) setProduct(p)
    })
    return () => {
      ok = false
    }
  }, [slug])

  if (product === null) {
    return <Navigate to="/" replace />
  }

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-[var(--muted)]">
        Se încarcă…
      </div>
    )
  }

  const onAdd = () => {
    add(product, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <nav className="text-sm text-[var(--muted)]">
        <Link to="/" className="hover:text-[var(--accent)]">
          Acasă
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/categorii/${product.category}`}
          className="hover:text-[var(--accent)]"
        >
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--fg)]">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-[var(--elevated)] text-[var(--muted)]" />
          )}
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[var(--fg)] md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-semibold text-[var(--accent)]">
            {formatRon(product.price_ron)}
          </p>
          {product.description && (
            <p className="mt-6 text-[var(--muted)] leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--elevated)]">
              <button
                type="button"
                className="p-3 text-[var(--fg)] hover:bg-[var(--border)]/50"
                aria-label="Scade"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center font-medium">
                {qty}
              </span>
              <button
                type="button"
                className="p-3 text-[var(--fg)] hover:bg-[var(--border)]/50"
                aria-label="Adaugă"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-[var(--accent-fg)] min-w-[12rem] hover:opacity-90"
            >
              <ShoppingBag className="h-5 w-5" />
              Adaugă în coș
            </button>
          </div>
          {added && (
            <p className="mt-4 text-sm text-[var(--accent)]">
              Produs adăugat!{' '}
              <Link to="/cos" className="underline">
                Vezi coșul
              </Link>
            </p>
          )}

          <ul className="mt-10 space-y-2 text-sm text-[var(--muted)]">
            <li>• Livrare în 2–5 zile lucrătoare în România</li>
            <li>• Retur 14 zile, conform OUG 34/2014</li>
            <li>• Garanție la electrice conform producător</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function formatRon(n: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0,
  }).format(n)
}
