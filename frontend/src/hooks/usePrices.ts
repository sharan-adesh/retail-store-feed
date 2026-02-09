import { useState, useEffect } from 'react'
import { searchPrices, updatePrice, deletePrice } from '../api/priceApi.js'
import { PriceRecord, SearchQuery } from '../types/index.js'
import toast from 'react-hot-toast'

interface UsePricesState {
  query: SearchQuery
  results: PriceRecord[]
  loading: boolean
}

export const usePrices = () => {
  const [state, setState] = useState<UsePricesState>({
    query: {
      store_id: '',
      sku: '',
      product_name: '',
    },
    results: [],
    loading: false,
  })

  // Perform search on mount
  useEffect(() => {
    search()
  }, [])

  const setQuery = (query: SearchQuery) => {
    setState((prev) => ({ ...prev, query }))
  }

  const search = async (customQuery?: SearchQuery) => {
    const queryToUse = customQuery || state.query
    setState((prev) => ({ ...prev, loading: true }))

    try {
      const results = await searchPrices(queryToUse)
      setState((prev) => ({
        ...prev,
        results,
        loading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Search failed'
      toast.error(errorMessage)
      setState((prev) => ({
        ...prev,
        loading: false,
      }))
    }
  }

  const editRecord = async (record: PriceRecord, updates: Partial<PriceRecord>): Promise<boolean> => {
    try {
      const updated = await updatePrice(record.id, updates)
      setState((prev) => ({
        ...prev,
        results: prev.results.map((r) => (r.id === updated.id ? updated : r)),
      }))
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Update failed'
      toast.error(errorMessage)
      return false
    }
  }

  const deleteRecord = async (id: number): Promise<boolean> => {
    try {
      await deletePrice(id)
      setState((prev) => ({ ...prev, results: prev.results.filter((r) => r.id !== id) }))
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Delete failed'
      toast.error(errorMessage)
      return false
    }
  }

  return {
    ...state,
    setQuery,
    search,
    editRecord,
    deleteRecord,
  }
}
