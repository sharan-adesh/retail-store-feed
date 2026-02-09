export interface PriceRecord {
  id: number
  store_id: string
  sku: string
  product_name: string | null
  price: string
  date: string
  created_at?: string
  updated_at?: string
}

export interface SearchQuery {
  store_id?: string
  sku?: string
  product_name?: string
  from_date?: string
  to_date?: string
  min_price?: string
  max_price?: string
  limit?: string
  offset?: string
}

export interface UploadResponse {
  inserted: number
}

export interface ErrorResponse {
  error: string
}
