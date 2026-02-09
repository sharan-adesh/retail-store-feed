import express, { Router, Request, Response } from 'express'
import userService from '../services/UserService.js'
import { RegisterRequest, LoginRequest, AuthResponse } from '../models/User.js'

const router: Router = express.Router()

/**
 * POST /auth/register - Register a new user
 */
router.post('/register', async (req: Request<{}, AuthResponse | { error: string }, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' })
      return
    }

    const auth = await userService.register({ email, password })
    res.json(auth)
  } catch (err) {
    const message = (err as Error).message
    res.status(400).json({ error: message })
  }
})

/**
 * POST /auth/login - Login a user
 */
router.post('/login', async (req: Request<{}, AuthResponse | { error: string }, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' })
      return
    }

    const auth = await userService.login({ email, password })
    res.json(auth)
  } catch (err) {
    const message = (err as Error).message
    res.status(401).json({ error: message })
  }
})

export default router
