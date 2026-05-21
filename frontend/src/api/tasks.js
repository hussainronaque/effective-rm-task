const BASE_URL = import.meta.env.VITE_API_URL || '';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchTasks = () =>
  fetch(`${BASE_URL}/tasks`, { headers: authHeaders() }).then((r) => r.json());

export const createTask = (data) =>
  fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateTask = (id, data) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteTask = (id) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then((r) => r.json());
