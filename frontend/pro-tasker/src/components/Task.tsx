type TaskProps = {
  task: {
    _id: string;
    title: string;
    description?: string;
    status?: string;
  };
  onClick: () => void;
};

function Task({ task, onClick }: TaskProps) {
  return (
    <div
      onClick={onClick}
      className="
        bg-slate-900
        border border-slate-800
        rounded-lg
        p-3
        cursor-pointer
        hover:border-slate-700
        transition
      "
    >
      <h3 className="text-sm font-semibold text-slate-100 truncate">
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