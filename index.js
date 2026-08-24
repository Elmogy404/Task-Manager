const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const pool = require("./db/pool");
const initDB = require("./db/init");

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
  apis: ["./index.js"],
};
const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
/**
 * @swagger
 * /:
 *   get:
 *     summary: API info
 *     responses:
 *       200:
 *         description: API information
 */
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
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
 *  /tasks:
 *   get:
 *     summary: Get all tasks sorted by title
 *     parameters:
 *       - in: query
 *         name: done
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter tasks by completion status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/tasks", async (req, res) => {
  let query = "SELECT * FROM tasks";
  const values = [];
  const conditions = [];

  if (req.query.done !== undefined) {
    conditions.push(`done = $${values.length + 1}`);
    values.push(req.query.done === "true");
  }
  if (req.query.search) {
    conditions.push(`title ILIKE $${values.length + 1}`);
    values.push(`%${req.query.search}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY title ASC";
  const result = await pool.query(query, values);
  res.status(200).json(result.rows);
});
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Title is required
 */
app.post("/tasks", async (req, res) => {
  const { title } = req.body || {};
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }
  const result = await pool.query(
    `INSERT INTO tasks (title,done)
    VALUES ($1, false) RETURNING *`,
    [title],
  );
  res.status(201).json(result.rows[0]);
});
/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *    summary: Read a specifc task
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      404:
 *        description: NOT found
 *      200:
 *        description: found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *
 */
app.get("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  } else {
    return res.status(200).json(result.rows[0]);
  }
});
/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    summary: update a task
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              done:
 *                type: boolean
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *       404:
 *          description: NOT found
 *       400:
 *          description: Invalid request body
 *       200:
 *          description: UPDATED!!
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Task'
 */
app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body || {};
  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "At least title or done is required",
    });
  }
  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res.status(400).json({
      error: "Invalid title",
    });
  }
  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({
      error: "Invalid done value",
    });
  }
  const result = await pool.query(
    `UPDATE tasks
    SET 
      title = COALESCE($1, title),
      done = COALESCE($2, done),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
    [title ?? null, done ?? null, id],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Task " + id + " not found" });
  }
  res.status(200).json(result.rows[0]);
});

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *    summary: delete a task
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      404:
 *        description: NOT found
 *      204:
 *        description: DELETED!!
 */
app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [id],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.sendStatus(204);
});
