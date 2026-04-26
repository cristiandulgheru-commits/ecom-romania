import { createClient } from '@supabase/supabase-js'

export type OrderLine = {
  product_id: string
  name: string
  quantity: number
  price_ron: number
}

export type OrderPayload = {
  customer_name: string
  email: string
  phone?: string
  address?: string
  city?: string
  payment_method: 'ramburs' | 'card'
  items: OrderLine[]
}

function isOrderPayload(x: unknown): x is OrderPayload {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  if (typeof o.customer_name !== 'string' || o.customer_name.length < 2) return false
  if (typeof o.email !== 'string' || !o.email.includes('@')) return false
  if (o.payment_method !== 'ramburs' && o.payment_method !== 'card') return false
  if (!Array.isArray(o.items) || o.items.length === 0) return false
  for (const it of o.items) {
    if (!it || typeof it !== 'object') return false
    const l = it as Record<string, unknown>
    if (typeof l.product_id !== 'string') return false
    if (typeof l.name !== 'string') return false
    if (typeof l.quantity !== 'number' || l.quantity < 1) return false
    if (typeof l.price_ron !== 'number' || l.price_ron < 0) return false
  }
  return true
}

export async function processOrderPayload(
  body: unknown,
): Promise<{ id: string } | { error: string }> {
  if (!isOrderPayload(body)) {
    return { error: 'Date comenzi invalide' }
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return { error: 'Lipsește configurația Supabase (server)' }
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const subtotal = body.items.reduce(
    (s, i) => s + i.price_ron * i.quantity,
    0,
  )
  if (subtotal > 1_000_000) {
    return { error: 'Valoare totală prea mare' }
  }

  for (const line of body.items) {
    const { data: product, error: pe } = await supabase
      .from('products')
      .select('id, price_ron, name')
      .eq('id', line.product_id)
      .single()
    if (pe || !product) {
      return { error: `Produs indisponibil: ${line.name}` }
    }
    if (Number(product.price_ron) !== line.price_ron) {
      return { error: 'Prețul a fost actualizat. Reîmprospătează pagina.' }
    }
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: body.customer_name.trim().slice(0, 200),
      email: body.email.trim().slice(0, 320),
      phone: (body.phone || '').trim().slice(0, 40) || null,
      address: (body.address || '').trim().slice(0, 500) || null,
      city: (body.city || '').trim().slice(0, 100) || null,
      payment_method: body.payment_method,
      items: body.items,
      total_ron: Math.round(subtotal * 100) / 100,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message || 'Nu am putut salva comanda' }
  }
  if (!data?.id) {
    return { error: 'Răspuns neașteptat de la baza de date' }
  }
  return { id: data.id }
}
