const express = require("express");
const router = express.Router();
const validateTaskId = require("../middleware/validateTaskId");
const controller = require("../controllers/tasksController");
const authMiddleware = require("../middleware/auth");
const validateTaskQuery = require("../middleware/validateTaskQuery");
router.use(authMiddleware);

router.get("/", validateTaskQuery, controller.getAllTasks);

router.get("/:id", validateTaskId, controller.getTaskById);

router.post("/", controller.postTask);

router.put("/:id", validateTaskId, controller.putTask);

router.delete("/:id", validateTaskId, controller.deleteTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Read a specific task
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      404:
 *        description: Task not found
 *      401:
 *        description: Unauthorized
 *      200:
 *        description: Task found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *
 */

/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Update a task
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
 *        description: Task not found
 *       400:
 *        description: Invalid request body
 *       200:
 *        description: Task updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *       401:
 *        description: Unauthorized
 */

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: Delete a task
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      404:
 *        description: Task not found
 *      204:
 *        description: Task deleted
 *      401:
 *        description: Unauthorized
 */

module.exports = router;
