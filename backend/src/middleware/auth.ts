import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthRequest extends Request {
  userId?: number
  email?: string
}

/**
 * Middleware to verify JWT token from Authorization header
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Access token required' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
    req.userId = decoded.userId
    req.email = decoded.email
    next()
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' })
  }
}

export default verifyToken
