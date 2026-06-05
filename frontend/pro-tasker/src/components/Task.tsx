
type TaskProps = {
  task: {
    _id: string;
    title: string;
    description?: string;
    status?: string;
  };
  onClick: () => void;
  onDelete: () => void;
};

function Task({ task, onClick, onDelete}: TaskProps) {
    
  return (
    <div
      onClick={onClick}
      className="
        relative
        bg-slate-900
        border border-slate-800
        rounded-lg
        p-3
        cursor-pointer
        hover:border-slate-700
        transition
      "
    >
      {/* CLEAN X ICON (always visible, subtle hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete()
        }}
        className="
          absolute
          top-2
          right-2
          text-slate-500
          hover:text-red-400
          transition
          p-1
          rounded
        "
        aria-label="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* CONTENT */}
      <h3 className="text-sm font-semibold text-slate-100 truncate pr-6">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.status && (
        <span className="text-[10px] mt-2 inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {task.status}
        </span>
      )}
    </div>
  );
}

export default Task;