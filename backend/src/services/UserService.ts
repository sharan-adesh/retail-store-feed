import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/database.js'
import { User, AuthResponse, RegisterRequest, LoginRequest } from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export class UserService {
  /**
   * Register a new user
   */
  async register(req: RegisterRequest): Promise<AuthResponse> {
    const { email, password } = req

    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      throw new Error('Email already registered')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    )

    const user = result.rows[0]
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }

  /**
   * Login a user
   */
  async login(req: LoginRequest): Promise<AuthResponse> {
    const { email, password } = req

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password')
    }

    const user = result.rows[0] as User
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      throw new Error('Invalid email or password')
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }

  /**
   * Verify JWT token and return user info
   */
  async verifyToken(token: string): Promise<{ userId: number; email: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
      return decoded
    } catch (err) {
      throw new Error('Invalid or expired token')
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT id, email, created_at, updated_at FROM users WHERE id = $1', [id])
    return result.rows.length > 0 ? (result.rows[0] as User) : null
  }
}

export default new UserService()
