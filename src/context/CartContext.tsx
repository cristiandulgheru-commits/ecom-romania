import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Product } from '../types'

const STORAGE = 'ecom-romania-cart-v1'

export type CartLine = {
  productId: string
  name: string
  priceR: number
  imageUrl: string | null
  quantity: number
}

type Ctx = {
  lines: CartLine[]
  add: (product: Product, qty: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  subtotal: number
  count: number
}

const CartContext = createContext<Ctx | null>(null)

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as CartLine[]
  } catch {
    return []
  }
}

function saveLines(lines: CartLine[]) {
  localStorage.setItem(STORAGE, JSON.stringify(lines))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadLines())

  useEffect(() => {
    saveLines(lines)
  }, [lines])

  const add = useCallback((product: Product, qty: number) => {
    setLines((prev) => {
      const q = Math.max(1, Math.min(99, Math.floor(qty)))
      const i = prev.findIndex((l) => l.productId === product.id)
      if (i < 0) {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            priceR: product.price_ron,
            imageUrl: product.image_url,
            quantity: q,
          },
        ]
      }
      const next = [...prev]
      next[i] = {
        ...next[i]!,
        priceR: product.price_ron,
        quantity: Math.min(99, next[i]!.quantity + q),
      }
      return next
    })
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    const q = Math.max(0, Math.min(99, Math.floor(qty)))
    setLines((prev) => {
      if (q === 0) return prev.filter((l) => l.productId !== productId)
      return prev.map((l) =>
        l.productId === productId ? { ...l, quantity: q } : l,
      )
    })
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.priceR * l.quantity, 0),
    [lines],
  )

  const count = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  )

  const value = useMemo<Ctx>(
    () => ({ lines, add, setQty, remove, clear, subtotal, count }),
    [lines, add, setQty, remove, clear, subtotal, count],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart inside CartProvider')
  return c
}
