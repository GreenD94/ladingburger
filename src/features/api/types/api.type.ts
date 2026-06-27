export type ProductFromAPI = {
  id: number
  name: string
  description: string | null
  price: number
  is_active: boolean
}

export type SaleItemFromAPI = {
  id: number
  product_id: number
  product_name: string | null
  quantity: number
  unit_price: number
}

export type SaleFromAPI = {
  id: number
  store_id: number | null
  customer_id: number | null
  customer_phone: string | null
  customer_name: string | null
  total_amount: number | null
  status: string
  created_at: string | null
  updated_at: string | null
  items: SaleItemFromAPI[]
}

export type TokenFromAPI = {
  access_token: string
  token_type: string
}

export type UserFromAPI = {
  id: number
  email: string
  is_active: boolean
  roles: string[]
}
