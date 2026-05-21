const BASE = '/tasks';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchTasks = () =>
  fetch(BASE, { headers: authHeaders() }).then((r) => r.json());

export const createTask = (data) =>
  fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateTask = (id, data) =>
  fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteTask = (id) =>
  fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then((r) => r.json());
