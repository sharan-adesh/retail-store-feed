import React from 'react'
import { PriceRecord } from '../types/index.js'

interface ConfirmDeleteModalProps {
  open: boolean
  record: PriceRecord | null
  onClose: () => void
  onConfirm: () => Promise<boolean>
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, record, onClose, onConfirm }) => {
  const [working, setWorking] = React.useState(false)

  if (!open || !record) return null

  const handleConfirm = async () => {
    setWorking(true)
    const ok = await onConfirm()
    setWorking(false)
    if (ok) onClose()
  }

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3>Delete Record #{record.id}</h3>
        <p>Are you sure you want to delete <strong>{record.product_name || 'this record'}</strong>?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} disabled={working}>Cancel</button>
          <button onClick={handleConfirm} disabled={working} style={{ color: 'white', background: '#dc3545' }}>{working ? 'Deleting...' : 'Delete'}</button>
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
  background: '#fff', padding: 16, borderRadius: 6, width: 360, boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
}

export default ConfirmDeleteModal
