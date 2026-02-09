import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth = false, children, ...props }) => {
  const baseStyles: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
    danger: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
  }

  const disabledStyles: React.CSSProperties = {
    opacity: 0.6,
    cursor: 'not-allowed',
  }

  const styles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(props.disabled && disabledStyles),
  }

  return (
    <button {...props} style={styles}>
      {children}
    </button>
  )
}
