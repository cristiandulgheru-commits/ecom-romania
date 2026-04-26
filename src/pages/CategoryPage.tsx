import { useParams, Navigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { CATEGORY_LABELS, type Category } from '../types'

function isCategory(s: string | undefined): s is Category {
  return Boolean(s && Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, s))
}

function CategoryList({ category }: { category: Category }) {
  const { products, loading, error } = useProducts(category)
  return (
    <>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--fg)] md:text-4xl">
        {CATEGORY_LABELS[category]}
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        {products.length} produse disponibile
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-2xl bg-[var(--elevated)]"
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  )
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  if (!isCategory(slug)) {
    return <Navigate to="/" replace />
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CategoryList category={slug} />
    </div>
  )
}
