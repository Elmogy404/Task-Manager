const pool = require("./pool");
async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  const result = await pool.query("SELECT COUNT(*) FROM tasks");
  if (Number(result.rows[0].count) === 0) {
    await pool.query(`INSERT INTO tasks (title,done)
      VALUES
          ('Learn Express', false),
          ('Build a CRUD API', true),
          ('Submit assignment', false)`);
  }
}
module.exports = initDB;
