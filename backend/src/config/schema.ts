import pool from './database.js';

const initSchema = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS prices (
        id SERIAL PRIMARY KEY,
        store_id VARCHAR(255) NOT NULL,
        sku VARCHAR(255) NOT NULL,
        product_name VARCHAR(255),
        price NUMERIC(10, 2),
        date VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_store_id ON prices(store_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sku ON prices(sku);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_date ON prices(date);
    `);

    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Failed to initialize schema', err);
    throw err;
  }
};

// If run directly, initialize schema and exit
if (import.meta.url === `file://${process.argv[1]}`) {
  initSchema()
    .then(() => {
      console.log('Schema initialization complete');
      process.exit(0);
    })
    .catch((err: Error) => {
      console.error('Schema initialization failed:', err);
      process.exit(1);
    });
}

export default initSchema;
