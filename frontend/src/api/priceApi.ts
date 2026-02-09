import axios from 'axios'
import { PriceRecord, SearchQuery, UploadResponse } from '../types/index.js'

const API_URL = '/api'

const apiClient = axios.create({
  baseURL: API_URL,
})

// Add JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Upload a CSV file with price records
 */
export const uploadPrices = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Search for price records based on filters
 */
export const searchPrices = async (query: SearchQuery): Promise<PriceRecord[]> => {
  const params: Partial<SearchQuery> = {}
  Object.keys(query).forEach((key) => {
    const value = query[key as keyof SearchQuery]
    if (value) {
      params[key as keyof SearchQuery] = value
    }
  })

  const response = await apiClient.get<PriceRecord[]>('/search', { params })
  return response.data
}

/**
 * Get a single price record by ID
 */
export const getPriceById = async (id: number): Promise<PriceRecord> => {
  const response = await apiClient.get<PriceRecord>(`/records/${id}`)
  return response.data
}

/**
 * Update a price record
 */
export const updatePrice = async (id: number, updates: Partial<PriceRecord>): Promise<PriceRecord> => {
  const response = await apiClient.put<PriceRecord>(`/records/${id}`, updates)
  return response.data
}

/**
 * Delete a price record
 */
export const deletePrice = async (id: number): Promise<void> => {
  await apiClient.delete(`/records/${id}`)
}

export default apiClient
