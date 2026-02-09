import React, { useState, useEffect } from 'react'
import { PriceRecord } from '../types/index.js'

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
    setSaving(true)
    const success = await onSave({ product_name: productName, price })
    setSaving(false)
    if (success) onClose()
  }

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3>Edit Record #{record.id}</h3>
        <div style={{ marginBottom: 8 }}>
          <label>Product name</label>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} disabled={saving}>Cancel</button>
          <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
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
