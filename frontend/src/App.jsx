import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Is the backend running?');
    }
  };

  const handleAdd = async (taskData) => {
    const newTask = await createTask(taskData);
    if (newTask.error) { setError(newTask.error); return; }
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const updated = await updateTask(id, { status: nextStatus });
    if (updated.error) { setError(updated.error); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleUpdate = (updated) => {
    if (updated.error) { setError(updated.error); return; }
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const pending   = tasks.filter((t) => t.status === 'pending').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-sm text-gray-400 mt-1">
            {pending} pending · {completed} completed
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-center justify-between">
            {error}
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-4">✕</button>
          </div>
        )}

        {/* Add task form */}
        <TaskForm onAdd={handleAdd} />

        {/* Task list */}
        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

      </div>
    </div>
  );
}
