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
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`ALTER TABLE tasks ALTER COLUMN user_id DROP NOT NULL`);
  const result = await pool.query("SELECT COUNT(*) FROM tasks");
  if (Number(result.rows[0].count) === 0) {
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash) VALUES ('seed@example.com', 'seed') RETURNING id`
    );
    const seedUserId = userResult.rows[0].id;
    await pool.query(`INSERT INTO tasks (title, done, user_id)
      VALUES
          ('Learn Express', false, $1),
          ('Build a CRUD API', true, $1),
          ('Submit assignment', false, $1)`,
      [seedUserId]
    );
  }
}
module.exports = initDB;
