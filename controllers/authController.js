const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const jwt = require("jsonwebtoken");

function validate(email, password) {
  if (!email && !password) {
    return "Email and password are required";
  }
  if (!email) {
    return "Email is required";
  }
  if (!password) {
    return "Password is required";
  }
  return null;
}

async function signup(req, res) {
  const { email, password } = req.body;
  const error = validate(email, password);
  if (error) {
    return res.status(400).json({ error });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
        VALUES ($1, $2) RETURNING id, email`,
    [email, passwordHash],
  );
  res.status(201).json(result.rows[0]);
}

async function login(req, res) {
  const { email, password } = req.body;
  const error = validate(email, password);
  if (error) {
    return res.status(400).json({ error });
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

module.exports = {
  signup,
  login,
};
