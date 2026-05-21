const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /tasks — fetch all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks — create a task
router.post('/', async (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), description?.trim() || null, priority || 'medium']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id — update task (partial update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
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
      'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4 WHERE id = $5 RETURNING *',
      [updatedTitle, updatedDescription, updatedPriority, updatedStatus, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
