const express = require("express");
const router = express.Router();
const controller = require("../controllers/tasksController");

router.get("/", controller.getAllTasks);

router.get("/:id", controller.getTaskById);

router.post("/", controller.postTask);

router.put("/:id", controller.putTask);

router.delete("/:id", controller.deleteTask);

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

module.exports = router;
