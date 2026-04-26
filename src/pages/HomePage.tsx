import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, Tablet, Watch } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { CATEGORY_LABELS, type Category } from '../types'

const icons: Record<Category, typeof Watch> = {
  ceasuri: Watch,
  tablete: Tablet,
  gradina: Leaf,
  electronic: Sparkles,
}

export function HomePage() {
  const { products, loading, error } = useProducts()

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            România · livrare națională
          </p>
          <p
            className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--accent)] md:text-4xl"
            aria-label="Salut Cristian"
          >
            Salut, Cristian
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--fg)] md:text-4xl lg:text-5xl">
            Electronice & grădină, cu un design gândit pentru tine.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            Ceasuri de mână, tablete, unelte și gadgeturi — prețuri în RON,
            opțiuni de plată la livrare sau card.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/categorii/electronic"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-fg)] transition hover:opacity-90"
            >
              Descoperă ofertele
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/categorii/gradina"
              className="inline-flex items-center rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--elevated)]"
            >
              Produse grădină
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)] md:text-3xl">
          Categorii
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => {
            const Icon = icons[c]
            return (
              <Link
                key={c}
                to={`/categorii/${c}`}
                className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--elevated)] text-[var(--accent)] transition group-hover:bg-[var(--accent)]/10">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 font-[family-name:var(--font-display)] text-lg font-medium text-[var(--fg)]">
                  {CATEGORY_LABELS[c]}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">Vezi produsele</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--elevated)]/30 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)] md:text-3xl">
                Recomandări
              </h2>
              <p className="mt-1 text-[var(--muted)]">
                Cele mai noi produse din magazin
              </p>
            </div>
            <Link
              to="/categorii/electronic"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Toate produsele →
            </Link>
          </div>

          {error && (
            <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-[var(--elevated)]"
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
