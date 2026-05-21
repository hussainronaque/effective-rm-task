import { useState } from 'react';
import TaskItem from './TaskItem';

const FILTERS = ['all', 'pending', 'completed'];

export default function TaskList({ tasks, filter, onFilterChange, onToggle, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();

  const filtered = tasks.filter((t) => {
    const matchesStatus = filter === 'all' || t.status === filter;
    const matchesSearch =
      !query ||
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors capitalize ${
                filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          {query ? `No tasks matching "${search}".` : 'No tasks here.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
