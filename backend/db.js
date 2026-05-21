require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/taskmanager',
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                 SERIAL PRIMARY KEY,
      email              TEXT NOT NULL UNIQUE,
      password_hash      TEXT NOT NULL,
      is_verified        BOOLEAN NOT NULL DEFAULT FALSE,
      verification_token TEXT,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT    NOT NULL,
      description TEXT,
      priority    TEXT    NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      status      TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // add user_id to existing tasks table if it was created before auth was added
  await pool.query(`
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  `);
};

initDb().catch((err) => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});

module.exports = pool;
