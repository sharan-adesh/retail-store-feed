import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import priceRoutes from './src/routes/priceRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { verifyToken } from './src/middleware/auth.js';
import initSchema from './src/config/schema.js';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(bodyParser.json());

// Public auth routes (no JWT required)
app.use('/api/auth', authRoutes);

// Protected price routes (JWT required)
app.use('/api', verifyToken, priceRoutes);

app.get('/', (req, res) => {
  res.type('text/plain').send('Retail Pricing API');
});

// Initialize schema on startup
initSchema().catch((err: Error) => {
  console.error('Failed to initialize schema on startup:', err);
  process.exit(1);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
