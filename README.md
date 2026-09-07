# Task Manager — Full Stack Application

A full-stack task management application built with **Node.js, Express, Supabase** (backend + PostgreSQL) and **React + Vite** (frontend). Features JWT-based authentication (login/signup), full CRUD operations on tasks, task statistics, client-side sorting, and a polished dark-themed UI.

## Features

### Backend
- User authentication (login & signup) with JWT tokens
- Rate limiting on login (5 attempts per 15 minutes)
- Full CRUD operations on tasks (Create, Read, Update, Delete)
- Filter tasks by done status (All / Completed / Pending)
- Search tasks by title
- Task statistics (total, completed, pending — per user)
- Request validation
- Persistent PostgreSQL storage via Supabase
- Swagger UI documentation
- Login attempt throttling
- Automatic table creation on startup

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
- PostgreSQL via Supabase
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

## Live Demo

- **Frontend**: [https://task-manager-eoa73xq42-elmogy404s-projects.vercel.app/](https://task-manager-eoa73xq42-elmogy404s-projects.vercel.app/)
- **Backend**: [https://task-manager-j2oasa.fly.dev](https://task-manager-j2oasa.fly.dev)
- **API Docs**: [https://task-manager-j2oasa.fly.dev/docs](https://task-manager-j2oasa.fly.dev/docs)
- **Health**: [https://task-manager-j2oasa.fly.dev/health](https://task-manager-j2oasa.fly.dev/health)

## Local Development Setup

### Prerequisites
- Node.js (v18+)
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

Create a `.env` file in the project root with your Supabase credentials:
```env
DB_HOST=db.qstcdmcitzdocizzdyfp.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
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

### Step 4: Run the backend
```bash
npm run dev
```
Server runs on `http://localhost:3000`. The Supabase database tables (`users`, `login_attempts`, `tasks`) are created automatically on startup.

### Step 5: Run the frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`.

### Step 6: Test in browser
Open `http://localhost:5173`. Sign up, log in, create tasks, filter, sort, and manage your tasks.

## Deployment

### Deploy Backend on Fly.io (free)

1. Install [Fly.io CLI](https://fly.io/docs/handbook/getting-started/#install-flyctl)
2. Sign in: `flyctl auth login`
3. Create project: `flyctl launch --name task-manager-j2oasa --region ams --dockerfile Dockerfile`
4. Set secrets: `flyctl secrets set DB_PASSWORD=... JWT_SECRET=...`
5. Deploy: `flyctl deploy -a task-manager-j2oasa`
6. The app is available at `https://task-manager-j2oasa.fly.dev`

Alternatively, use the Fly.io web dashboard:
1. Go to [fly.io](https://fly.io) and sign in with GitHub
2. Click **Launch App** → connect `Elmogy404/Task-Manager`
3. Use the **NodeJS 18** preset Dockerfile
4. Add environment variables:
   - `DB_HOST` = `db.qstcdmcitzdocizzdyfp.supabase.co`
   - `DB_PORT` = `5432`
   - `DB_USER` = `postgres`
   - `DB_PASSWORD` = your Supabase password
   - `DB_NAME` = `postgres`
   - `JWT_SECRET` = your secret
5. Click **Deploy**

### Deploy Frontend on Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import `Task-Manager` repository
3. Framework Preset: `Vite`
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Install Command: `npm install`
8. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://task-manager-j2oasa.fly.dev`
   - Type: **Config** (not Secret, since `VITE_` prefix)
9. Click **Deploy**
10. Vercel gives you a URL like `https://task-manager-xxxx.vercel.app`

### Demo Link
`[https://task-manager-eoa73xq42-elmogy404s-projects.vercel.app](https://task-manager-eoa73xq42-elmogy404s-projects.vercel.app/)`

### Quick Deploy Commands
```bash
# Push to GitHub first
cd Task-Manager
git add .
git commit -m "Deploy-ready"
git push origin main

# Deploy on Fly.io (backend)
flyctl deploy -a task-manager-j2oasa

# Deploy on Vercel (frontend)
cd frontend
vercel --prod
```

## Supabase Setup

### Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and sign in with GitHub
2. Click **New Project** → set name, password, and region
3. Go to **Settings → Database → Connections** → copy the `postgresql://` URI
4. Use that URI in your `.env` file as `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

The Supabase database automatically creates the required tables on first startup via `db/init.js`.

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
curl -X POST https://task-manager-j2oasa.fly.dev/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Buy milk","done":false}'
```

Get pending tasks:
```bash
curl https://task-manager-j2oasa.fly.dev/tasks?done=false \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Get task statistics:
```bash
curl https://task-manager-j2oasa.fly.dev/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Login:
```bash
curl -X POST https://task-manager-j2oasa.fly.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123"}'
```

## Swagger UI

Open after deploying:
```
https://task-manager-j2oasa.fly.dev/docs
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
├── controllers/
│   ├── authController.js
│   └── tasksController.js
├── db/
│   ├── init.js
│   └── pool.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── validateAuth.js
│   ├── validateTaskId.js
│   └── validateTaskQuery.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── services/
│   └── loginAttempts.js
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
├── Dockerfile
├── fly.toml
├── .dockerignore
├── .gitignore
├── package.json
└── README.md
```

## License

This project was created for learning purposes.
