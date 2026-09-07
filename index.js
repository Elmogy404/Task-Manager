const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const initDB = require("./db/init");
const pool = require("./db/pool");
const tasks = require("./routes/tasks.js");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10kb" }));

initDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(
      "Database connection failed, server starting without tables:",
      err.message,
    );
  });

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            done: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./index.js", "./routes/tasks.js", "./routes/auth.js"],
};
const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/tasks", tasks);
app.use("/auth", authRoutes);
/**
 * @swagger
 * /:
 *   get:
 *     summary: API information
 *     responses:
 *       200:
 *         description: API info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 */
app.get("/", (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * @swagger
 * /stats:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Task statistics for the authenticated user
 *     responses:
 *       200:
 *         description: User task statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 done:
 *                   type: integer
 *                 pending:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
app.get("/stats", authMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE done = true) AS done,
    COUNT(*) FILTER (WHERE done = false) AS pending
    FROM tasks WHERE user_id = $1;`,
    [req.user.userId],
  );
  res.json({
    total: Number(result.rows[0].total),
    done: Number(result.rows[0].done),
    pending: Number(result.rows[0].pending),
  });
});

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
