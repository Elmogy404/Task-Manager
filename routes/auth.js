const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { validateSignup, validateLogin } = require("../middleware/validateAuth");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
});

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

router.post("/signup", validateSignup, signup);
router.post("/login", loginLimiter, validateLogin, login);
module.exports = router;
