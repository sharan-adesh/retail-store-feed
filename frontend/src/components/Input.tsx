import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
  helperText?: string
}

export const Input: React.FC<InputProps> = ({ label, error = false, helperText, disabled, ...props }) => {
  const baseStyles: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
    borderRadius: '6px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  const focusStyles: React.CSSProperties = {
    borderColor: error ? '#dc3545' : '#007bff',
    outline: 'none',
  }

  const disabledStyles: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed',
    opacity: 0.7,
  }

  const styles: React.CSSProperties = {
    ...baseStyles,
    ...(disabled && disabledStyles),
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
          {label}
        </label>
      )}
      <input
        {...props}
        disabled={disabled}
        style={styles}
        onFocus={(e) => {
          if (props.onFocus) props.onFocus(e)
          e.currentTarget.style.borderColor = error ? '#dc3545' : '#007bff'
        }}
        onBlur={(e) => {
          if (props.onBlur) props.onBlur(e)
          e.currentTarget.style.borderColor = error ? '#dc3545' : '#ddd'
        }}
      />
      {helperText && (
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: error ? '#dc3545' : '#666' }}>
          {helperText}
        </p>
      )}
    </div>
  )
}
