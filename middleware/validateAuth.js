function validateSignup(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      error: "Email is required",
    });
  }
  if (typeof password !== "string" || password === "") {
    return res.status(400).json({
      error: "Password is required",
    });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }
  if (password.length > 72) {
    return res.status(400).json({
      error: "Password must not exceed 72 characters",
    });
  }
  req.body.email = normalizedEmail;
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      error: "Email is required",
    });
  }
  if (typeof password !== "string" || password === "") {
    return res.status(400).json({
      error: "Password is required",
    });
  }
  req.body.email = email.trim().toLowerCase();
  next();
}

module.exports = {
  validateSignup,
  validateLogin,
};
