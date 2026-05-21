# Task Manager – Effective-RM Technical Assignment

A simple full-stack Task Management app built with Node.js (Express) + PostgreSQL on the backend and React (Vite + Tailwind CSS) on the frontend.

---

## Project Structure

```
effective-rm-task/
├── backend/         # Node.js + Express REST API
└── frontend/        # React + Vite + Tailwind CSS
```

---

## Backend Setup

### Requirements
- Node.js v18+
- PostgreSQL (running locally or via connection string)

### Database Setup

```bash
psql postgres -c "CREATE DATABASE taskmanager;"
```

### Environment Variables

Create `backend/.env`:
```
DATABASE_URL=postgresql://localhost:5432/taskmanager
PORT=3001
```

### Install & Run

```bash
cd backend
npm install
npm start          # runs on http://localhost:3001
# or
npm run dev        # with auto-reload via nodemon
```

The `tasks` table is created automatically on first run.

---

## Frontend Setup

### Requirements
- Node.js v18+
- Backend must be running on port 3001

### Install & Run

```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

Vite proxies `/tasks` requests to `http://localhost:3001`, so no CORS config needed during development.

---

## API Endpoints

Base URL: `http://localhost:3001`

### GET /tasks
Fetch all tasks, ordered by newest first.

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Fix login bug",
    "description": "Token expiry not handled",
    "priority": "high",
    "status": "pending",
    "created_at": "2026-05-20T16:00:00.000Z"
  }
]
```

---

### POST /tasks
Create a new task.

**Body:**
```json
{
  "title": "Fix login bug",        // required
  "description": "Some details",   // optional
  "priority": "high"               // optional: "low" | "medium" | "high" (default: "medium")
}
```

**Response 201:** Created task object.

---

### PUT /tasks/:id
Update a task. Send only the fields you want to change.

**Body (any combination):**
```json
{
  "status": "completed",
  "title": "Updated title",
  "priority": "low"
}
```

**Response 200:** Updated task object.

---

### DELETE /tasks/:id
Delete a task by ID.

**Response 200:**
```json
{ "message": "Task deleted" }
```

---

## Task Schema

| Field       | Type    | Notes                             |
|-------------|---------|-----------------------------------|
| id          | INTEGER | Auto-increment primary key        |
| title       | TEXT    | Required                          |
| description | TEXT    | Optional                          |
| priority    | TEXT    | `low` / `medium` / `high`        |
| status      | TEXT    | `pending` / `completed`          |
| created_at  | TIMESTAMPTZ | UTC datetime, set automatically |

---

## Assumptions & Notes

- PostgreSQL is used as the relational database. Connection configured via `DATABASE_URL` in `.env`.
- Vite dev proxy handles CORS during development. In production, CORS is enabled on the Express server.
- `PUT /tasks/:id` is a partial update — unset fields retain their existing values.
- Filter tabs (All / Pending / Completed) implemented as a bonus feature.
