const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/authController");
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
router.post("/logout", authMiddleware, logout);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   format: jwt
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Logout (client-side token discard)
 *     responses:
 *       204:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Verify authentication
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

module.exports = router;
