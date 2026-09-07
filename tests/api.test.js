// AI Generated
const request = require("supertest");

const API_URL = "http://localhost:3000";

describe("API", () => {
  let userA;
  let userB;

  let tokenA;
  let tokenB;

  const uniqueId = Date.now();

  const emailA = `test-a-${uniqueId}@example.com`;
  const emailB = `test-b-${uniqueId}@example.com`;

  const password = "TestPassword123";

  // =========================================================
  // SETUP
  // =========================================================

  beforeAll(async () => {
    // Create user A
    const signupA = await request(API_URL).post("/auth/signup").send({
      email: emailA,
      password,
    });

    expect(signupA.status).toBe(201);

    userA = signupA.body;

    // Create user B
    const signupB = await request(API_URL).post("/auth/signup").send({
      email: emailB,
      password,
    });

    expect(signupB.status).toBe(201);

    userB = signupB.body;

    // Login user A
    const loginA = await request(API_URL).post("/auth/login").send({
      email: emailA,
      password,
    });

    expect(loginA.status).toBe(200);
    expect(loginA.body).toHaveProperty("token");

    tokenA = loginA.body.token;

    // Login user B
    const loginB = await request(API_URL).post("/auth/login").send({
      email: emailB,
      password,
    });

    expect(loginB.status).toBe(200);
    expect(loginB.body).toHaveProperty("token");

    tokenB = loginB.body.token;
  });

  // =========================================================
  // HEALTH
  // =========================================================

  describe("Health", () => {
    test("GET /health -> 200", async () => {
      const res = await request(API_URL).get("/health").expect(200);

      expect(res.body).toBeDefined();
    });
  });

  // =========================================================
  // AUTH - SIGNUP
  // =========================================================

  describe("Signup", () => {
    test("signup with valid data -> 201", async () => {
      const email = `signup-valid-${Date.now()}@example.com`;

      const res = await request(API_URL)
        .post("/auth/signup")
        .send({
          email,
          password,
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("email", email);
    });

    test("signup without email -> 400", async () => {
      await request(API_URL)
        .post("/auth/signup")
        .send({
          password,
        })
        .expect(400);
    });

    test("signup without password -> 400", async () => {
      await request(API_URL)
        .post("/auth/signup")
        .send({
          email: `missing-password-${Date.now()}@example.com`,
        })
        .expect(400);
    });

    test("signup with invalid email -> 400", async () => {
      await request(API_URL)
        .post("/auth/signup")
        .send({
          email: "not-an-email",
          password,
        })
        .expect(400);
    });

    test("signup with short password -> 400", async () => {
      await request(API_URL)
        .post("/auth/signup")
        .send({
          email: `short-${Date.now()}@example.com`,
          password: "123",
        })
        .expect(400);
    });

    test("signup with password longer than 72 characters -> 400", async () => {
      await request(API_URL)
        .post("/auth/signup")
        .send({
          email: `long-password-${Date.now()}@example.com`,
          password: "a".repeat(73),
        })
        .expect(400);
    });

    test("duplicate email -> 409", async () => {
      const res = await request(API_URL).post("/auth/signup").send({
        email: emailA,
        password,
      });

      expect(res.status).toBe(409);
    });
  });

  // =========================================================
  // AUTH - LOGIN
  // =========================================================

  describe("Login", () => {
    test("valid login -> 200 and JWT", async () => {
      const res = await request(API_URL)
        .post("/auth/login")
        .send({
          email: emailA,
          password,
        })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(typeof res.body.token).toBe("string");
    });

    test("second user valid login -> 200 and JWT", async () => {
      const res = await request(API_URL)
        .post("/auth/login")
        .send({
          email: emailB,
          password,
        })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(typeof res.body.token).toBe("string");
    });

    test("wrong password -> 401", async () => {
      const email = `wrong-password-${Date.now()}@example.com`;

      await request(API_URL)
        .post("/auth/signup")
        .send({
          email,
          password,
        })
        .expect(201);

      await request(API_URL)
        .post("/auth/login")
        .send({
          email,
          password: "WrongPassword123",
        })
        .expect(401);
    });

    test("non-existing email -> 401", async () => {
      const email = `does-not-exist-${Date.now()}@example.com`;

      await request(API_URL)
        .post("/auth/login")
        .send({
          email,
          password,
        })
        .expect(401);
    });

    test("login without email -> 400", async () => {
      await request(API_URL)
        .post("/auth/login")
        .send({
          password,
        })
        .expect(400);
    });

    test("login without password -> 400", async () => {
      await request(API_URL)
        .post("/auth/login")
        .send({
          email: `missing-login-password-${Date.now()}@example.com`,
        })
        .expect(400);
    });

    test("login with invalid email format -> 400", async () => {
      await request(API_URL)
        .post("/auth/login")
        .send({
          email: "invalid-email",
          password,
        })
        .expect(400);
    });
  });

  // =========================================================
  // AUTH - PROTECTED ROUTE
  // =========================================================

  describe("Authentication middleware", () => {
    test("protected route without token -> 401", async () => {
      await request(API_URL).get("/auth/protected").expect(401);
    });

    test("protected route with invalid token -> 401", async () => {
      await request(API_URL)
        .get("/auth/protected")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });

    test("protected route with malformed authorization header -> 401", async () => {
      await request(API_URL)
        .get("/auth/protected")
        .set("Authorization", "Invalid invalid-token")
        .expect(401);
    });

    test("protected route with valid token -> 200", async () => {
      const res = await request(API_URL)
        .get("/auth/protected")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("userId", userA.id);
      expect(res.body.user).toHaveProperty("email", userA.email);
    });
  });

  // =========================================================
  // TASK - CREATE
  // =========================================================

  describe("Create tasks", () => {
    test("create task with valid token -> 201", async () => {
      const res = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Task A",
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("title", "Task A");
      expect(res.body).toHaveProperty("user_id", userA.id);
      expect(res.body).toHaveProperty("done", false);
    });

    test("second user creates task -> 201", async () => {
      const res = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          title: "Task B",
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("user_id", userB.id);
    });

    test("create task without authentication -> 401", async () => {
      await request(API_URL)
        .post("/tasks")
        .send({
          title: "Unauthorized task",
        })
        .expect(401);
    });

    test("create task without title -> 400", async () => {
      await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({})
        .expect(400);
    });

    test("create task with empty title -> 400", async () => {
      await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "",
        })
        .expect(400);
    });

    test("create task with whitespace title -> 400", async () => {
      await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "   ",
        })
        .expect(400);
    });

    test("create task with non-string title -> 400", async () => {
      await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: 123,
        })
        .expect(400);
    });
  });

  // =========================================================
  // TASK - GET ALL
  // =========================================================

  describe("Get tasks", () => {
    test("get all tasks -> 200", async () => {
      const res = await request(API_URL)
        .get("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);

      for (const task of res.body) {
        expect(task.user_id).toBe(userA.id);
      }
    });

    test("get tasks without authentication -> 401", async () => {
      await request(API_URL).get("/tasks").expect(401);
    });

    test("filter done=true -> 200", async () => {
      await request(API_URL)
        .get("/tasks?done=true")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);
    });

    test("filter done=false -> 200", async () => {
      await request(API_URL)
        .get("/tasks?done=false")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);
    });

    test("invalid done value -> 400", async () => {
      await request(API_URL)
        .get("/tasks?done=hello")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(400);
    });

    test("search -> 200", async () => {
      const res = await request(API_URL)
        .get("/tasks?search=Task")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    test("search with no results -> 200 and empty array", async () => {
      const res = await request(API_URL)
        .get("/tasks?search=this-task-definitely-does-not-exist")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  // =========================================================
  // TASK - GET BY ID
  // =========================================================

  describe("Get task by ID", () => {
    let taskId;

    beforeAll(async () => {
      const res = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Get By ID Task",
        })
        .expect(201);

      taskId = res.body.id;
    });

    test("get own task -> 200", async () => {
      const res = await request(API_URL)
        .get(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.id).toBe(taskId);
      expect(res.body.user_id).toBe(userA.id);
    });

    test("invalid task ID -> 400", async () => {
      await request(API_URL)
        .get("/tasks/abc")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(400);
    });

    test("zero task ID -> 400", async () => {
      await request(API_URL)
        .get("/tasks/0")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(400);
    });

    test("negative task ID -> 400", async () => {
      await request(API_URL)
        .get("/tasks/-1")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(400);
    });

    test("non-existing task -> 404", async () => {
      await request(API_URL)
        .get("/tasks/999999999")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(404);
    });
  });

  // =========================================================
  // OWNERSHIP
  // =========================================================

  describe("Task ownership", () => {
    let userATaskId;
    let userBTaskId;

    beforeAll(async () => {
      const taskA = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "User A Private Task",
        })
        .expect(201);

      userATaskId = taskA.body.id;

      const taskB = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          title: "User B Private Task",
        })
        .expect(201);

      userBTaskId = taskB.body.id;
    });

    test("user B cannot read user A task -> 404", async () => {
      await request(API_URL)
        .get(`/tasks/${userATaskId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(404);
    });

    test("user B cannot update user A task -> 404", async () => {
      await request(API_URL)
        .put(`/tasks/${userATaskId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          title: "Hacked",
        })
        .expect(404);
    });

    test("user B cannot delete user A task -> 404", async () => {
      await request(API_URL)
        .delete(`/tasks/${userATaskId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(404);
    });

    test("user A cannot see user B task in list", async () => {
      const res = await request(API_URL)
        .get("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      const ids = res.body.map((task) => task.id);

      expect(ids).not.toContain(userBTaskId);
    });

    test("user B cannot see user A task in list", async () => {
      const res = await request(API_URL)
        .get("/tasks")
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(200);

      const ids = res.body.map((task) => task.id);

      expect(ids).not.toContain(userATaskId);
    });
  });

  // =========================================================
  // TASK - UPDATE
  // =========================================================

  describe("Update tasks", () => {
    let taskId;

    beforeAll(async () => {
      const res = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Update Task",
        })
        .expect(201);

      taskId = res.body.id;
    });

    test("update title -> 200", async () => {
      const res = await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Updated Task",
        })
        .expect(200);

      expect(res.body.title).toBe("Updated Task");
    });

    test("update done -> 200", async () => {
      const res = await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          done: true,
        })
        .expect(200);

      expect(res.body.done).toBe(true);
    });

    test("update both fields -> 200", async () => {
      const res = await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Final Task",
          done: false,
        })
        .expect(200);

      expect(res.body.title).toBe("Final Task");
      expect(res.body.done).toBe(false);
    });

    test("update with empty body -> 400", async () => {
      await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({})
        .expect(400);
    });

    test("update with invalid title -> 400", async () => {
      await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "",
        })
        .expect(400);
    });

    test("update with whitespace title -> 400", async () => {
      await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "   ",
        })
        .expect(400);
    });

    test("update with invalid done -> 400", async () => {
      await request(API_URL)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          done: "true",
        })
        .expect(400);
    });

    test("update non-existing task -> 404", async () => {
      await request(API_URL)
        .put("/tasks/999999999")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Does Not Exist",
        })
        .expect(404);
    });
  });

  // =========================================================
  // TASK - DELETE
  // =========================================================

  describe("Delete tasks", () => {
    let taskId;

    beforeAll(async () => {
      const res = await request(API_URL)
        .post("/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Delete Task",
        })
        .expect(201);

      taskId = res.body.id;
    });

    test("delete own task -> 204", async () => {
      await request(API_URL)
        .delete(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(204);
    });

    test("deleted task no longer exists -> 404", async () => {
      await request(API_URL)
        .get(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(404);
    });

    test("delete non-existing task -> 404", async () => {
      await request(API_URL)
        .delete("/tasks/999999999")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(404);
    });

    test("delete without authentication -> 401", async () => {
      await request(API_URL).delete("/tasks/999999999").expect(401);
    });
  });
});
