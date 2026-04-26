export type Category =
  | 'ceasuri'
  | 'tablete'
  | 'gradina'
  | 'electronic'

export type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  price_ron: number
  image_url: string | null
  category: Category
  created_at?: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  ceasuri: 'Ceasuri de mână',
  tablete: 'Tablete',
  gradina: 'Grădină',
  electronic: 'Electronică',
}
