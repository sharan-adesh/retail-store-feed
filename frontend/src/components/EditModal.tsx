import React, { useState, useEffect } from 'react'
import { PriceRecord } from '../types/index.js'
import { Input, Button } from './index.js'

interface EditModalProps {
  open: boolean
  record: PriceRecord | null
  onClose: () => void
  onSave: (updates: { product_name?: string; price?: string }) => Promise<boolean>
}

export const EditModal: React.FC<EditModalProps> = ({ open, record, onClose, onSave }) => {
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (record) {
      setProductName(record.product_name || '')
      setPrice(record.price)
    }
  }, [record])

  if (!open || !record) return null

  const handleSave = async () => {
    if (!productName.trim()) {
      return
    }
    setSaving(true)
    const success = await onSave({ product_name: productName.trim(), price })
    setSaving(false)
    if (success) onClose()
  }

  const isValid = productName.trim().length > 0 && price.trim().length > 0

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3>Edit Record #{record.id}</h3>
        <Input
          label="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          error={!isValid && productName.trim().length === 0}
          helperText={!isValid && productName.trim().length === 0 ? 'Product name is required' : undefined}
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          error={!isValid && price.trim().length === 0}
          helperText={!isValid && price.trim().length === 0 ? 'Price is required' : undefined}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose} disabled={saving} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !isValid} variant="primary">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
}

const modalStyle: React.CSSProperties = {
  background: '#fff', padding: 16, borderRadius: 6, width: 420, boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
}

export default EditModal
