const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const jwt = require("jsonwebtoken");
const {
  recordFailedAttempt,
  checkLoginAllowed,
  clearFailedAttempts,
} = require("../services/loginAttempts");

async function signup(req, res) {
  const { email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash)
          VALUES ($1, $2) RETURNING id, email`,
      [email, passwordHash],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    throw err;
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const allowed = await checkLoginAllowed(email, req.ip);
  if (!allowed) {
    return res.status(429).json({
      error: "Too many failed login attempts. Please try again later.",
    });
  }
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    await recordFailedAttempt(email, req.ip);
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    await recordFailedAttempt(email, req.ip);
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  await clearFailedAttempts(email, req.ip);
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.status(200).json({
    message: "Login Successful",
    token,
  });
}

async function logout(req, res) {
  res.sendStatus(204);
}

module.exports = {
  signup,
  login,
  logout,
};
