import pool from '../config/database.js';
import { PriceRow, PriceRecord, SearchQuery } from '../models/Price.js';

export class PriceService {
  /**
   * Insert multiple price records from CSV upload
   */
  async insertPrices(records: PriceRow[]): Promise<number> {
    let insertedCount = 0;

    try {
      for (const record of records) {
        await pool.query(
          'INSERT INTO prices (store_id, sku, product_name, price, date) VALUES ($1, $2, $3, $4, $5)',
          [record.store_id, record.sku, record.product_name, record.price, record.date]
        );
        insertedCount++;
      }
    } catch (err) {
      throw new Error(`Failed to insert prices: ${(err as Error).message}`);
    }

    return insertedCount;
  }

  /**
   * Search prices based on query filters
   */
  async searchPrices(query: SearchQuery): Promise<PriceRecord[]> {
    const { store_id, sku, product_name, from_date, to_date, min_price, max_price, limit = '100', offset = '0' } = query;
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (store_id) {
      conditions.push(`store_id = $${paramIndex++}`);
      params.push(store_id);
    }
    if (sku) {
      conditions.push(`sku = $${paramIndex++}`);
      params.push(sku);
    }
    if (product_name) {
      conditions.push(`product_name ILIKE $${paramIndex++}`);
      params.push(`%${product_name}%`);
    }
    if (from_date) {
      conditions.push(`date >= $${paramIndex++}`);
      params.push(from_date);
    }
    if (to_date) {
      conditions.push(`date <= $${paramIndex++}`);
      params.push(to_date);
    }
    if (min_price) {
      conditions.push(`price >= $${paramIndex++}`);
      params.push(min_price);
    }
    if (max_price) {
      conditions.push(`price <= $${paramIndex++}`);
      params.push(max_price);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    params.push(Number(limit));
    params.push(Number(offset));

    const sql = `SELECT id, store_id, sku, product_name, price, date, created_at, updated_at FROM prices ${where} ORDER BY updated_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;

    try {
      const result = await pool.query(sql, params);
      return result.rows as PriceRecord[];
    } catch (err) {
      throw new Error(`Failed to search prices: ${(err as Error).message}`);
    }
  }

  /**
   * Get a single price record by ID
   */
  async getPriceById(id: string | number): Promise<PriceRecord | null> {
    try {
      const result = await pool.query('SELECT * FROM prices WHERE id = $1', [id]);
      return result.rows.length > 0 ? (result.rows[0] as PriceRecord) : null;
    } catch (err) {
      throw new Error(`Failed to fetch price: ${(err as Error).message}`);
    }
  }

  /**
   * Update a price record
   */
  async updatePrice(id: string | number, updates: Partial<PriceRow>): Promise<PriceRecord | null> {
    try {
      const existing = await this.getPriceById(id);
      if (!existing) {
        return null;
      }

      const { store_id, sku, product_name, price, date } = updates;
      const sql = `UPDATE prices SET store_id = $1, sku = $2, product_name = $3, price = $4, date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`;

      const result = await pool.query(sql, [
        store_id != null ? store_id : existing.store_id,
        sku != null ? sku : existing.sku,
        product_name != null ? product_name : existing.product_name,
        price != null ? price : existing.price,
        date != null ? date : existing.date,
        id,
      ]);

      return result.rows[0] as PriceRecord;
    } catch (err) {
      throw new Error(`Failed to update price: ${(err as Error).message}`);
    }
  }

  /**
   * Delete a price record
   */
  async deletePrice(id: string | number): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM prices WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (err) {
      throw new Error(`Failed to delete price: ${(err as Error).message}`);
    }
  }
}

export default new PriceService();
