import React, { useState } from 'react'
import { usePrices } from '../hooks/usePrices.js'
import { SearchQuery } from '../types/index.js'
import { PriceTable, EditModal, ConfirmDeleteModal, Input, Button } from './index.js'
import { PriceRecord } from '../types/index.js'
import toast from 'react-hot-toast'


export const SearchSection: React.FC = () => {
  const { query, results, loading, setQuery, search, editRecord, deleteRecord } = usePrices()
  const [localQuery, setLocalQuery] = useState<SearchQuery>(query)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuery(localQuery)
    search(localQuery)
  }

  const handleInputChange = (key: keyof SearchQuery, value: string) => {
    setLocalQuery((prev) => ({ ...prev, [key]: value }))
  }

  const [editing, setEditing] = useState<PriceRecord | null>(null)
  const [deleting, setDeleting] = useState<PriceRecord | null>(null)

  const handleEdit = (id: number) => {
    const row = results.find((r) => r.id === id)
    if (!row) return
    setEditing(row)
  }

  const handleEditSave = async (updates: { product_name?: string; price?: string }) => {
    if (!editing) return false
    const success = await editRecord(editing, updates)
    if (success) {
      toast.success('Record updated successfully')
      setEditing(null)
    }
    return success
  }

  const handleDelete = (id: number) => {
    const row = results.find((r) => r.id === id)
    if (!row) return
    setDeleting(row)
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return false
    const success = await deleteRecord(deleting.id)
    if (success) {
      toast.success('Record deleted successfully')
      setDeleting(null)
    }
    return success
  }

  return (
    <section className="card">
      <h2>Search Records</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '16px', alignItems: 'start' }}>

        <Input
          placeholder="Store ID"
          value={localQuery.store_id || ''}
          onChange={(e) => handleInputChange('store_id', e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="SKU"
          value={localQuery.sku || ''}
          onChange={(e) => handleInputChange('sku', e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Product Name"
          value={localQuery.product_name || ''}
          onChange={(e) => handleInputChange('product_name', e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <PriceTable records={results} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />

      <EditModal open={!!editing} record={editing} onClose={() => setEditing(null)} onSave={handleEditSave} />
      <ConfirmDeleteModal open={!!deleting} record={deleting} onClose={() => setDeleting(null)} onConfirm={handleDeleteConfirm} />
    </section>
  )
}
