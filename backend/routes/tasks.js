const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, title.trim(), description?.trim() || null, priority || 'medium']
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = existing.rows[0];
    const updatedTitle       = title       !== undefined ? title.trim()       : task.title;
    const updatedDescription = description !== undefined ? description.trim() : task.description;
    const updatedPriority    = priority    !== undefined ? priority            : task.priority;
    const updatedStatus      = status      !== undefined ? status              : task.status;

    if (!updatedTitle) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, priority=$3, status=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [updatedTitle, updatedDescription, updatedPriority, updatedStatus, id, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
