import { useState } from 'react';
import { updateTask } from '../api/tasks';

const PRIORITY_STYLES = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-green-100 text-green-700',
};

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing]     = useState(false);
  const [title, setTitle]         = useState(task.title);
  const [description, setDesc]    = useState(task.description || '');
  const [priority, setPriority]   = useState(task.priority);
  const [saving, setSaving]       = useState(false);

  const completed = task.status === 'completed';

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const updated = await updateTask(task.id, { title: title.trim(), description: description.trim(), priority });
    onUpdate(updated);
    setEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDesc(task.description || '');
    setPriority(task.priority);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="border border-indigo-300 rounded-xl p-4 bg-white shadow-sm space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Task title"
        />
        <textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Description (optional)"
        />
        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={handleCancel} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200'}`}>
      {/* Green status dot */}
      <span
        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${completed ? 'bg-green-500' : 'bg-gray-300'}`}
        title={completed ? 'Completed' : 'Pending'}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
        )}
      </div>

      {/* Priority badge */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
        {task.priority}
      </span>

      {/* Edit */}
      <button
        onClick={() => setEditing(true)}
        className="shrink-0 text-gray-300 hover:text-indigo-500 transition-colors"
        aria-label="Edit task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {/* Complete toggle */}
      <button
        onClick={() => onToggle(task.id, task.status)}
        className={`shrink-0 transition-colors ${completed ? 'text-green-500 hover:text-gray-400' : 'text-gray-300 hover:text-green-500'}`}
        aria-label={completed ? 'Mark pending' : 'Mark completed'}
        title={completed ? 'Mark as pending' : 'Mark as completed'}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
