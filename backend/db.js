require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/taskmanager',
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       TEXT    NOT NULL,
      description TEXT,
      priority    TEXT    NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      status      TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

initDb().catch((err) => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});

module.exports = pool;
