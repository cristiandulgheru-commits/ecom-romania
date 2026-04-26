import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DEMO_PRODUCTS } from '../data/demo'
import type { Category, Product } from '../types'

export function useProducts(category?: Category) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProducts(
        category
          ? DEMO_PRODUCTS.filter((p) => p.category === category)
          : DEMO_PRODUCTS,
      )
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    let q = supabase
      .from('products')
      .select(
        'id, slug, name, description, price_ron, image_url, category, created_at',
      )
      .order('created_at', { ascending: false })
    if (category) {
      q = q.eq('category', category)
    }
    const { data, error: err } = await q
    if (err) {
      setError(err.message)
      setProducts([])
    } else {
      setProducts(
        (data as Product[]).map((p) => ({
          ...p,
          price_ron: Number(p.price_ron),
        })),
      )
    }
    setLoading(false)
  }, [category])

  useEffect(() => {
    void load()
  }, [load])

  return { products, loading, error, refetch: load }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null
  }
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, description, price_ron, image_url, category, created_at',
    )
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return { ...data, price_ron: Number((data as Product).price_ron) } as Product
}
