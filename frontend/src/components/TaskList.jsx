import TaskItem from './TaskItem';

const FILTERS = ['all', 'pending', 'completed'];

export default function TaskList({ tasks, filter, onFilterChange, onToggle, onUpdate, onDelete }) {
  const filtered = tasks.filter((t) => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
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

      {/* Task count */}
      <p className="text-xs text-gray-400">
        {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          No tasks here.
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
