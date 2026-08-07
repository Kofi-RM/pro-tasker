import type { TaskType } from "../type/Task";
import { useDraggable } from "@dnd-kit/core";


function DraggableTask({ task, onClick, onDelete }: {
  task: TaskType;
  onClick: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id });

  const style = transform
  ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: 50,
      transition: isDragging ? undefined : "transform 200ms ease",
    }
  : undefined;

  const statusColor =
    task.status === "to do"
      ? "from-rose-400 to-rose-600"
      : task.status === "in progress"
      ? "from-amber-300 to-amber-500"
      : "from-emerald-400 to-emerald-600";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-3 ${isDragging ? "opacity-60" : ""}`}
    >
      <div
        onClick={onClick}
        className="
          group relative
          bg-slate-900/60
          border border-slate-800
          rounded-xl
          flex
          items-stretch
          overflow-hidden
          hover:border-slate-700
          hover:shadow-lg hover:shadow-black/30
          transition-colors duration-200
        "
      >
        <div className={`w-1 bg-gradient-to-b ${statusColor}`} />

        <div
          {...listeners}
          {...attributes}
          className="
            w-10 flex items-center justify-center
            cursor-grab active:cursor-grabbing
            text-slate-500 hover:text-slate-200
            border-r border-slate-800
          "
        >
          ⋮⋮
        </div>

        <div className="flex-1 flex flex-col justify-center p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-100 leading-snug">
              {task.title}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-xs text-slate-500 hover:text-red-400 transition"
            >
              ✕
            </button>
          </div>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DraggableTask;