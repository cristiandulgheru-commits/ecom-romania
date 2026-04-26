import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { OrderLine } from '../../lib/orderHandler'

export function CheckoutPage() {
  const { lines, subtotal, clear } = useCart()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [payment, setPayment] = useState<'ramburs' | 'card'>('ramburs')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Nu ai produse în coș</h1>
        <Link to="/" className="mt-4 inline-block text-[var(--accent)]">
          Acasă
        </Link>
      </div>
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const items: OrderLine[] = lines.map((l) => ({
      product_id: l.productId,
      name: l.name,
      quantity: l.quantity,
      price_ron: l.priceR,
    }))

    const body = {
      customer_name: name,
      email,
      phone,
      address,
      city,
      payment_method: payment,
      items,
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as { id?: string; error?: string }
      if (!res.ok || !data.id) {
        setErr(data.error || 'A apărut o eroare. Încearcă din nou.')
        setLoading(false)
        return
      }
      clear()
      nav(`/comanda/succes?id=${data.id}`, { replace: true })
    } catch {
      setErr('Nu s-a putut conecta la server.')
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--fg)]">
        Date livrare & plată
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Completează formularul. Comanda e procesată securizat prin Supabase.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm text-[var(--muted)]">Nume complet *</span>
            <input
              required
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <span className="text-sm text-[var(--muted)]">Email *</span>
            <input
              required
              type="email"
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span className="text-sm text-[var(--muted)]">Telefon</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm text-[var(--muted)]">Adresă</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm text-[var(--muted)]">Oraș</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-[var(--fg)]">
            Mod de plată
          </legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 has-[:checked]:border-[var(--accent)]">
              <input
                type="radio"
                name="pay"
                checked={payment === 'ramburs'}
                onChange={() => setPayment('ramburs')}
              />
              Ramburs la livrare
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 has-[:checked]:border-[var(--accent)]">
              <input
                type="radio"
                name="pay"
                checked={payment === 'card'}
                onChange={() => setPayment('card')}
              />
              Card online (demo)
            </label>
          </div>
        </fieldset>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-4">
          <p className="text-sm text-[var(--muted)]">Total de plată (TVA inclus)</p>
          <p className="text-2xl font-semibold text-[var(--fg)]">
            {new Intl.NumberFormat('ro-RO', {
              style: 'currency',
              currency: 'RON',
            }).format(subtotal)}
          </p>
        </div>

        {err && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] py-3.5 font-semibold text-[var(--accent-fg)] disabled:opacity-60"
        >
          {loading ? 'Se trimite…' : 'Plasează comanda'}
        </button>
      </form>
    </div>
  )
}
