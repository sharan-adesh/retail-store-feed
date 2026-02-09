import React from 'react'
import { PriceRecord } from '../types/index.js'

interface PriceTableProps {
  records: PriceRecord[]
  onEdit: (id: number) => void
  onDelete?: (id: number) => void
  loading?: boolean
}

export const PriceTable: React.FC<PriceTableProps> = ({ records, onEdit, onDelete, loading = false }) => {
  return (
    <table style={{ marginTop: '20px', opacity: loading ? 0.6 : 1 }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Store</th>
          <th>SKU</th>
          <th>Product</th>
          <th>Price</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '16px' }}>
              No records found
            </td>
          </tr>
        ) : (
          records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.store_id}</td>
              <td>{record.sku}</td>
              <td>{record.product_name}</td>
              <td>${record.price}</td>
              <td>{record.date}</td>
              <td>
                <button onClick={() => onEdit(record.id)} disabled={loading}>
                  Edit
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(record.id)}
                    disabled={loading}
                    style={{ marginLeft: 8, color: 'red' }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
