# Task Manager — Full Stack Application

A full-stack task management application built with **Node.js, Express, PostgreSQL** (backend) and **React + Vite** (frontend). Features JWT-based authentication (login/signup), full CRUD operations on tasks, task statistics, and a polished dark-themed UI. The API is documented with **Swagger (OpenAPI)**.

## Features

### Backend
- User authentication (login & signup) with JWT tokens
- Full CRUD operations on tasks (Create, Read, Update, Delete)
- Filter tasks by done status (All / Completed / Pending)
- Search tasks by title
- Task statistics (total, completed, pending counts)
- Request validation
- Persistent PostgreSQL storage
- Swagger UI documentation

### Frontend
- Dark-themed UI with animated gradient background
- Login / Sign Up forms with email and password icons
- Token persistence via localStorage (survives page refresh)
- One source of truth for authentication state in React
- Auth state checked on page load — no refresh needed
- Animated stat cards with number counters
- Task list with count badge, smooth hover and delete animations
- Search, filter, and create tasks
- Toast notifications for login/logout feedback
- Responsive design (mobile-friendly)

## Technologies

### Backend
- Node.js
- Express.js
- PostgreSQL (via `pg`)
- `dotenv`
- `jsonwebtoken`
- `bcrypt`
- `swagger-jsdoc` + `swagger-ui-express`

### Frontend
- React 19
- Vite
- CSS Variables (dark theme)
- Google Fonts (Inter + Space Grotesk)

## Database Setup

This application uses a PostgreSQL database. Create a database, then create a `.env` file in the project root:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=crud_api
JWT_SECRET=your_jwt_secret
```

On first start, the `tasks` and `users` tables are created automatically and seeded with sample data if the tables are empty.

## Installation

### Backend

```bash
npm install
npm run dev
```

The server runs on:
```
http://localhost:3000
```

Swagger UI:
```
http://localhost:3000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:
```
http://localhost:5173
```

## Authentication Flow

The frontend uses `localStorage` as the single source of truth for whether a user has a token:

```
No token → Show Login / Sign Up
Token exists → Show Dashboard + Logout
```

On page load, the frontend reads `localStorage.getItem("token")` to determine the UI state — no API call needed to check auth status.

- **Login**: `localStorage.setItem("token", data.token)` + React state update → UI switches immediately
- **Logout**: `localStorage.removeItem("token")` + React state reset → UI returns to unauthenticated state

## API Endpoints

| Method | Endpoint   | Description                         | Auth Required |
| ------ | ---------- | ----------------------------------- | ------------- |
| POST   | /auth/login    | Login with email & password         | No            |
| POST   | /auth/signup   | Create a new account                | No            |
| GET    | /tasks         | Get all tasks (filter by `done`, `search`) | Yes     |
| GET    | /tasks/:id     | Get a task by ID                    | Yes           |
| POST   | /tasks         | Create a task                       | Yes           |
| PUT    | /tasks/:id     | Update a task (title and/or done)   | Yes           |
| DELETE | /tasks/:id     | Delete a task                       | Yes           |
| GET    | /stats         | Task statistics                     | Yes           |
| GET    | /              | API information                     | No            |
| GET    | /health        | Health check                        | No            |
| GET    | /docs          | Swagger UI documentation            | No            |

## Example cURL

Create a task:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Buy milk"}'
```

Get pending tasks:
```bash
curl http://localhost:3000/tasks?done=false \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Get task statistics:
```bash
curl http://localhost:3000/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Swagger UI

Open:
```
http://localhost:3000/docs
```

![Swagger UI](images/swagger.png)

## Screenshots

> Add frontend screenshots below (dashboard, auth forms, task list, stats).

## License

This project was created for learning purposes.
