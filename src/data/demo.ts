import type { Product } from '../types'

/** Folosit când VITE_SUPABASE_* lipsește (previzualizare locală fără DB). */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'ceas-lux-a1',
    name: 'Ceas Chronograph Lux A1',
    description: 'Carcasă inox, rezistență la apă 50m.',
    price_ron: 1299,
    image_url:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
    category: 'ceasuri',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    slug: 'tableta-pro-11',
    name: 'Tabletă Pro 11" 128GB',
    description: 'Ecran IPS, Wi-Fi.',
    price_ron: 2149,
    image_url:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    category: 'tablete',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    slug: 'masina-tuns',
    name: 'Mașină tuns gazon electrică',
    description: 'Coș 50L, cablu 15m.',
    price_ron: 1899,
    image_url:
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
    category: 'gradina',
  },
]
