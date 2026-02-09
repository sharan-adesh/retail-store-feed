import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse';
import priceService from '../services/PriceService.js';
import { PriceRow, SearchQuery, UploadResponse } from '../models/Price.js';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /upload - Upload a CSV file with price records
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response<UploadResponse | { error: string }>): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const text = req.file.buffer.toString('utf8');

  parse(text, { columns: true, skip_empty_lines: true, trim: true }, async (err: Error | undefined, parsed?: any[]) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      const records: PriceRow[] = (parsed || []).map((row: any) => ({
        store_id: row['Store ID'] || row.store_id || row.storeId || row['store_id'],
        sku: row['SKU'] || row.sku,
        product_name: row['Product Name'] || row.product_name || row.name,
        price: parseFloat(row['Price'] || row.price) || 0,
        date: row['Date'] || row.date || new Date().toISOString(),
      }));

      const inserted = await priceService.insertPrices(records);
      res.json({ inserted });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
});

/**
 * GET /search - Search prices based on query filters
 */
router.get('/search', async (req: Request<{}, any, {}, SearchQuery>, res: Response): Promise<void> => {
  try {
    const results = await priceService.searchPrices(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /records/:id - Get a specific price record
 */
router.get('/records/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const record = await priceService.getPriceById(req.params.id);
    if (!record) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * PUT /records/:id - Update a price record
 */
router.put('/records/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await priceService.updatePrice(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * DELETE /records/:id - Delete a price record
 */
router.delete('/records/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await priceService.deletePrice(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
