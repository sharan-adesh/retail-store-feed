import React, { useState, useMemo } from 'react'
import { PriceRecord } from '../types/index.js'
import { FaEdit, FaSave, FaTrash, FaSearch } from "react-icons/fa";


interface PriceTableProps {
  records: PriceRecord[]
  onEdit: (id: number) => void
  onDelete?: (id: number) => void
  loading?: boolean
  rowsPerPage?: number
}

export const PriceTable: React.FC<PriceTableProps> = ({
  records,
  onEdit,
  onDelete,
  loading = false,
  rowsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const { paginatedRecords, totalPages } = useMemo(() => {
    const total = Math.ceil(records.length / rowsPerPage)
    const startIdx = (currentPage - 1) * rowsPerPage
    const endIdx = startIdx + rowsPerPage
    const paginated = records.slice(startIdx, endIdx)
    return { paginatedRecords: paginated, totalPages: total }
  }, [records, currentPage, rowsPerPage])

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <table style={{ marginTop: '20px', opacity: loading ? 0.6 : 1, width: '100%' }}>
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
            paginatedRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.store_id}</td>
                <td>{record.sku}</td>
                <td>{record.product_name}</td>
                <td>${record.price}</td>
                <td>{record.date}</td>
                <td>
                  <button onClick={() => onEdit(record.id)} disabled={loading} style={{background: 'none', border: 0, cursor: 'pointer'}}>
                    <FaEdit />
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(record.id)}
                      disabled={loading}
                      style={{ marginLeft: 8, color: '#dc3545', background: 'none', border: 0, cursor: 'pointer' }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {records.length > 0 && totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={loading}
                style={{
                  padding: '6px 10px',
                  backgroundColor: currentPage === page ? '#007bff' : '#f0f0f0',
                  color: currentPage === page ? 'white' : 'black',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: currentPage === page ? 'bold' : 'normal',
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>
            Next →
          </button>

          <span style={{ marginLeft: '10px', fontSize: '14px' }}>
            Page {currentPage} of {totalPages} ({records.length} total)
          </span>
        </div>
      )}
    </div>
  )
}
