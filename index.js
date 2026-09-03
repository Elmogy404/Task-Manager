const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const initDB = require("./db/init");
const tasks = require("./routes/tasks.js");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");

app.use(express.json());

initDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
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
    },
  },
  apis: ["./index.js", "./routes/tasks.js"],
};
const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/tasks", tasks);
app.use("/auth", authRoutes);

app.use(errorHandler);
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});
/**
 * @swagger
 * /:
 *   get:
 *     summary: API info
 *     responses:
 *       200:
 *         description: API information
 */

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
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

app.get("/stats", async (req, res) => {
  const result = await pool.query(`SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE done = true) AS done,
    COUNT(*) FILTER (WHERE done = false) AS pending
FROM tasks;`);
  res.json({
    total: Number(result.rows[0].total),
    done: Number(result.rows[0].done),
    pending: Number(result.rows[0].pending),
  });
});
/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Task statistics
 *     responses:
 *       200:
 *         description: Count of total, done and pending tasks
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
 */
