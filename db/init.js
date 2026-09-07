const pool = require("./pool");
async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS login_attempts (
    email TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 1,
    last_attempt_at TIMESTAMP NOT NULL,
    PRIMARY KEY (email, ip_address)
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done boolean NOT NULL DEFAULT false,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  const result = await pool.query("SELECT COUNT(*) FROM tasks");
  if (Number(result.rows[0].count) === 0) {
    await pool.query(`INSERT INTO tasks (title, done)
      VALUES
          ('Learn Express', false),
          ('Build a CRUD API', true),
          ('Submit assignment', false)`);
  }
}
module.exports = initDB;
