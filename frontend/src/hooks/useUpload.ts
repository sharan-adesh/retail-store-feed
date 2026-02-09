import { useState } from 'react'
import { uploadPrices } from '../api/priceApi.js'

interface UseUploadState {
  file: File | null
  loading: boolean
  error: string | null
  success: boolean
}

export const useUpload = () => {
  const [state, setState] = useState<UseUploadState>({
    file: null,
    loading: false,
    error: null,
    success: false,
  })

  const setFile = (file: File | null) => {
    setState((prev) => ({ ...prev, file, error: null, success: false }))
  }

  const upload = async (): Promise<number | null> => {
    if (!state.file) {
      setState((prev) => ({ ...prev, error: 'Please select a CSV file' }))
      return null
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await uploadPrices(state.file)
      setState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        file: null,
      }))
      return result.inserted
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return null
    }
  }

  const reset = () => {
    setState({
      file: null,
      loading: false,
      error: null,
      success: false,
    })
  }

  return {
    ...state,
    setFile,
    upload,
    reset,
  }
}
