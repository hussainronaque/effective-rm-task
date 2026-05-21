# Task Manager – Effective-RM Technical Assignment

A full-stack Task Management app built with Node.js (Express) + PostgreSQL on the backend and React (Vite + Tailwind CSS) on the frontend.

**Live Demo:** https://effective-rm-task-frontend.vercel.app

---

## Project Structure

```
effective-rm-task/
├── backend/         # Node.js + Express REST API
└── frontend/        # React + Vite + Tailwind CSS
```

---

## Features

- **Authentication** — JWT-based login/signup with email verification (Resend)
- **Task CRUD** — create, read, update, delete tasks
- **Status toggle** — mark tasks pending / completed
- **Inline edit** — update title, description, priority in place
- **Search** — real-time filter by title or description
- **Filter tabs** — All / Pending / Completed
- **Per-user data** — each user only sees their own tasks
- **Deployment** — backend + frontend on Vercel, PostgreSQL on Neon

---

## Local Setup

### Requirements
- Node.js v18+
- PostgreSQL running locally

### Backend

```bash
psql postgres -c "CREATE DATABASE taskmanager;"

cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Vite proxies `/tasks` and `/auth` to `http://localhost:3001` in dev — no CORS config needed.

### Backend Environment Variables (`backend/.env`)

```
DATABASE_URL=postgresql://localhost:5432/taskmanager
PORT=3001
JWT_SECRET=your-long-random-secret
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your-resend-api-key
APP_URL=http://localhost:3001
```

---

## API Endpoints

All `/tasks` routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create account, sends verification email |
| POST | `/auth/login` | Login, returns JWT |
| GET  | `/auth/verify?token=` | Verify email, redirects to frontend |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/tasks` | Fetch all tasks for authenticated user |
| POST   | `/tasks` | Create a task |
| PUT    | `/tasks/:id` | Partial update (title, description, priority, status) |
| DELETE | `/tasks/:id` | Delete a task |

### POST /tasks body
```json
{
  "title": "Fix login bug",        // required
  "description": "Some details",   // optional
  "priority": "high"               // "low" | "medium" | "high" (default: "medium")
}
```

---

## Task Schema

| Field       | Type        | Notes                           |
|-------------|-------------|---------------------------------|
| id          | INTEGER     | Auto-increment primary key      |
| user_id     | INTEGER     | Foreign key → users             |
| title       | TEXT        | Required                        |
| description | TEXT        | Optional                        |
| priority    | TEXT        | `low` / `medium` / `high`      |
| status      | TEXT        | `pending` / `completed`        |
| created_at  | TIMESTAMPTZ | UTC, set automatically         |

---

## Deployment

- **Backend:** Vercel (Express via `@vercel/node`) — https://effective-rm-task-backend.vercel.app
- **Frontend:** Vercel (Vite SPA) — https://effective-rm-task-frontend.vercel.app
- **Database:** Neon (serverless PostgreSQL)

---

## Assumptions & Notes

- `PUT /tasks/:id` is a partial update — omitted fields retain existing values.
- Tasks are scoped per user — users cannot access each other's tasks.
- JWT tokens expire after 7 days.
- **Email verification limitation:** Resend's `onboarding@resend.dev` sender (sandbox) can only deliver to the Resend account owner's email address. To send verification emails to any recipient, a verified custom domain is required in the Resend dashboard. The email infrastructure is fully implemented — this is purely a sandbox restriction of the free tier.
