import { Link, Outlet } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import type { Category } from '../types'
import { CATEGORY_LABELS } from '../types'

const cats: Category[] = ['ceasuri', 'tablete', 'gradina', 'electronic']

export function Layout() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-svh flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
          <Link
            to="/"
            className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--fg)] md:text-2xl"
          >
            Elektro<span className="text-[var(--accent)]">RO</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {cats.map((c) => (
              <Link
                key={c}
                to={`/categorii/${c}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--fg)]"
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cos"
              className="relative flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm font-medium transition hover:border-[var(--accent)]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Coș</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-xs font-bold text-[var(--accent-fg)]">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="rounded-lg border border-[var(--border)] p-2 md:hidden"
              aria-label="Meniu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 md:hidden">
            {cats.map((c) => (
              <Link
                key={c}
                to={`/categorii/${c}`}
                className="block rounded-lg px-2 py-2 text-[var(--muted)]"
                onClick={() => setOpen(false)}
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-[var(--border)] bg-[var(--elevated)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
                ElektroRO
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Magazin online cu livrare în România. Plăți securizate, garanție
                conform legislației UE.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--fg)]">Categorii</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                {cats.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/categorii/${c}`}
                      className="hover:text-[var(--accent)]"
                    >
                      {CATEGORY_LABELS[c]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--fg)]">Contact</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                suport@elektro-ro.demo
                <br />
                Luni–Vineri, 9:00–18:00
              </p>
            </div>
          </div>
          <p className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} ElektroRO — prețurile conțin TVA, în
            RON.
          </p>
        </div>
      </footer>
    </div>
  )
}
