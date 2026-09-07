const express = require("express");
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

app.use(express.json());

initDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed, server starting without tables:", err.message);
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
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/stats", authMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE done = true) AS done,
    COUNT(*) FILTER (WHERE done = false) AS pending
  FROM tasks Where user_id = $1;`,
    [req.user.userId],
  );
  res.json({
    total: Number(result.rows[0].total),
    done: Number(result.rows[0].done),
    pending: Number(result.rows[0].pending),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
