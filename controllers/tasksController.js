const pool = require("../db/pool");

async function getAllTasks(req, res) {
  let query = "SELECT * FROM tasks";
  const values = [req.user.userId];
  const conditions = ["user_id = $1"];

  if (req.query.done !== undefined) {
    conditions.push(`done = $${values.length + 1}`);
    values.push(req.query.done === "true");
  }
  if (req.query.search) {
    conditions.push(`title ILIKE $${values.length + 1}`);
    values.push(`%${req.query.search}%`);
  }

  query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY title ASC";
  const result = await pool.query(query, values);
  res.status(200).json(result.rows);
}

async function getTaskById(req, res) {
  const id = Number(req.params.id);
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [id, req.user.userId],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  return res.status(200).json(result.rows[0]);
}

async function postTask(req, res) {
  const { title, done } = req.body || {};
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }
  const result = await pool.query(
    `INSERT INTO tasks (title,done, user_id)
        VALUES ($1, $2, $3) RETURNING *`,
    [title, done, req.user.userId],
  );
  res.status(201).json(result.rows[0]);
}

async function putTask(req, res) {
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
        WHERE id = $3 AND user_id = $4
        RETURNING *`,
    [title ?? null, done ?? null, id, req.user.userId],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Task " + id + " not found" });
  }
  res.status(200).json(result.rows[0]);
}

async function deleteTask(req, res) {
  const id = Number(req.params.id);
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, req.user.userId],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.sendStatus(204);
}

module.exports = {
  getAllTasks,
  getTaskById,
  postTask,
  putTask,
  deleteTask,
};
