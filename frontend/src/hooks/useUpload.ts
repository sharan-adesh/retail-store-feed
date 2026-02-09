import { useState } from 'react'
import { uploadPrices } from '../api/priceApi.js'
import toast from 'react-hot-toast'

interface UseUploadState {
  file: File | null
  loading: boolean
}

export const useUpload = () => {
  const [state, setState] = useState<UseUploadState>({
    file: null,
    loading: false,
  })

  const setFile = (file: File | null) => {
    setState((prev) => ({ ...prev, file }))
  }

  const upload = async (): Promise<number | null> => {
    if (!state.file) {
      toast.error('Please select a CSV file')
      return null
    }

    setState((prev) => ({ ...prev, loading: true }))

    try {
      const result = await uploadPrices(state.file)
      setState((prev) => ({
        ...prev,
        loading: false,
        file: null,
      }))
      toast.success(`Successfully uploaded ${result.inserted} records`)
      return result.inserted
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed'
      toast.error(errorMessage)
      setState((prev) => ({ ...prev, loading: false }))
      return null
    }
  }

  const reset = () => {
    setState({
      file: null,
      loading: false,
    })
  }

  return {
    ...state,
    setFile,
    upload,
    reset,
  }
}
