# Task Manager — Full Stack Application

A full-stack task management application built with **Node.js, Express, PostgreSQL** (backend) and **React + Vite** (frontend). Features JWT-based authentication (login/signup), full CRUD operations on tasks, task statistics, client-side sorting, and a polished dark-themed UI.

## Features

### Backend
- User authentication (login & signup) with JWT tokens
- Rate limiting on login (5 attempts per 15 minutes)
- Full CRUD operations on tasks (Create, Read, Update, Delete)
- Filter tasks by done status (All / Completed / Pending)
- Search tasks by title
- Task statistics (total, completed, pending — per user)
- Request validation
- Persistent PostgreSQL storage
- Swagger UI documentation
- Login attempt throttling

### Frontend
- Dark-themed UI with animated gradient background
- Login / Sign Up forms with email and lock icons
- Token persistence via localStorage (survives page refresh)
- One source of truth for authentication state in React
- Auth state checked on page load — no refresh needed
- Animated stat cards with number counters
- Task list with count badge, smooth hover and delete animations
- Client-side sorting (Newest, Oldest, Title A-Z, Title Z-A, Recently updated)
- Search, filter, and create tasks
- Toast notifications for login/logout/create/update/delete
- Responsive design (mobile-friendly)

## Technologies

### Backend
- Node.js
- Express.js
- PostgreSQL (via `pg`)
- `dotenv`
- `jsonwebtoken`
- `bcrypt`
- `express-rate-limit`
- `swagger-jsdoc` + `swagger-ui-express`

### Frontend
- React 19
- Vite
- CSS Variables (dark theme)
- Google Fonts (Inter + Space Grotesk)

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm

### Step 1: Clone the repository
```bash
git clone https://github.com/Elmogy404/Task-Manager.git
cd Task-Manager
```

### Step 2: Backend setup
```bash
npm install
```

Create a `.env` file in the project root:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=tasks
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/tasks
JWT_SECRET=your_strong_secret_here
```

### Step 3: Frontend setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

### Step 4: Start PostgreSQL
Make sure your PostgreSQL server is running and create the `tasks` database:
```bash
createdb tasks
```

### Step 5: Run the backend
```bash
npm run dev
```
Server runs on `http://localhost:3000`. The database tables (`users`, `login_attempts`, `tasks`) are created automatically.

### Step 6: Run the frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`.

### Step 7: Test in browser
Open `http://localhost:5173`. Sign up, log in, create tasks, filter, sort, and manage your tasks.

## Deployment

### Deploy Backend on Render (free)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New → Web Service** → select your `Task-Manager` repository
3. Configure:
   - **Name**: `task-manager`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Root Directory**: leave empty (repo root)
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Compute**: `Starter` → `$0 / month` (free)
4. Add Environment Variables:
   - `DATABASE_URL` — Render auto-provides this when you add a PostgreSQL database
   - `JWT_SECRET` — your strong secret key
5. **Add a PostgreSQL database**: In the Render dashboard, click **"Add a database"** → `Starter` → free tier
6. Click **Deploy**
7. Note the deployed URL (e.g., `https://task-manager-xxxx.onrender.com`)

### Deploy Frontend on Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import `Task-Manager` repository
3. Framework Preset: `Vite`
4. Root Directory: `frontend`
5. Build Command: `cd frontend && npm install && npm run build`
6. Output Directory: `frontend/dist`
7. Install Command: `cd frontend && npm install`
8. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: your Render backend URL (e.g., `https://task-manager-xxxx.onrender.com`)
9. Click **Deploy**
10. Vercel gives you a URL like `https://task-manager-xxxx.vercel.app`

### Demo Link
`[Your deployed URL here]`

### Quick Deploy Commands
```bash
# Push to GitHub first
cd Task-Manager
git add .
git commit -m "Deploy-ready"
git push origin main

# Deploy on Render (backend auto-deploys from GitHub)
# Deploy on Vercel (frontend)
cd frontend
vercel --prod
```

## API Endpoints

| Method | Endpoint   | Description                         | Auth Required |
| ------ | ---------- | ----------------------------------- | ------------- |
| POST   | /auth/login    | Login with email & password         | No            |
| POST   | /auth/signup   | Create a new account                | No            |
| GET    | /auth/protected  | Verify authentication              | Yes           |
| GET    | /tasks         | Get all tasks (filter by `done`, `search`) | Yes |
| GET    | /tasks/:id     | Get a task by ID                    | Yes           |
| POST   | /tasks         | Create a task                       | Yes           |
| PUT    | /tasks/:id     | Update a task (title and/or done)   | Yes           |
| DELETE | /tasks/:id     | Delete a task                       | Yes           |
| GET    | /stats         | Task statistics (per user)          | Yes           |
| GET    | /              | API information                     | No            |
| GET    | /health        | Health check                        | No            |
| GET    | /docs          | Swagger UI documentation            | No            |

## Example cURL

Create a task:
```bash
curl -X POST https://your-app.onrender.com/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Buy milk","done":false}'
```

Get pending tasks:
```bash
curl https://your-app.onrender.com/tasks?done=false \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Get task statistics:
```bash
curl https://your-app.onrender.com/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Login:
```bash
curl -X POST https://your-app.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123"}'
```

## Swagger UI

Open after deploying:
```
https://your-app.onrender.com/docs
```

## Database Schema

### `users` table
| Column       | Type         | Description              |
| ------------ | ------------ | ------------------------ |
| id           | SERIAL       | Primary key              |
| email        | TEXT UNIQUE  | Email address            |
| password_hash| TEXT         | BCrypt hashed password   |
| created_at   | TIMESTAMP    | Account creation time    |

### `login_attempts` table
| Column       | Type         | Description              |
| ------------ | ------------ | ------------------------ |
| email        | TEXT         | Email (part of PK)       |
| ip_address   | TEXT         | IP address (part of PK)  |
| attempts     | INTEGER      | Failed login count       |
| last_attempt_at | TIMESTAMP  | Last attempt timestamp   |

### `tasks` table
| Column       | Type         | Description              |
| ------------ | ------------ | ------------------------ |
| id           | SERIAL       | Primary key              |
| title        | TEXT         | Task title               |
| done         | BOOLEAN      | Completion status        |
| user_id      | INTEGER      | Foreign key to users     |
| created_at   | TIMESTAMP    | Task creation time       |
| updated_at   | TIMESTAMP    | Last update time         |

## Folder Structure

```
Task-Manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── tasksController.js
│   ├── db/
│   │   ├── init.js
│   │   └── pool.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validateAuth.js
│   │   ├── validateTaskId.js
│   │   └── validateTaskQuery.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── services/
│   │   └── loginAttempts.js
│   ├── .env
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
├── package.json
└── README.md
```

## License

This project was created for learning purposes.
