const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const { use } = require("react");

async function signup(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    return res.status(400).json({ error: "Email and password are required" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
        VALUES ($1, $2) RETURNING id, email`,
    [email, password_hash],
  );
  res.status(201).json(result.rows[0]);
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    return res.status(400).json({ error: "Email and password are required" });
  }
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  res.status(200).json({
    message: "Login Successful",
    user: {
      id: user.id,
      email: user.email,
    },
  });
}

module.exports = {
  signup,
  login,
};
