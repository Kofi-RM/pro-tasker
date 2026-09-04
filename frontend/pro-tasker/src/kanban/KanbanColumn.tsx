import type { TaskStatus, TaskType } from "../type/Task";
import { useDroppable } from "@dnd-kit/core";

import { AnimatePresence, motion } from "framer-motion";
import DraggableTask from "./DraggableTask";
function KanbanColumn({
  title,
  status,
  tasks,
  onTaskClick,
  onTaskDelete
}: {
  title: string;
  status: TaskStatus;
  tasks: TaskType[];
  onTaskClick: (task: TaskType) => void;
  onTaskDelete: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-slate-950
        border ${isOver ? "border-indigo-400 bg-indigo-500/5" : "border-slate-800"}
        rounded-xl
        p-4
        min-h-[420px]
        transition-colors
      `}
    >
      <h3 className="font-bold mb-4">
        {title} ({tasks.length})
      </h3>
      {tasks.length === 0 && (
        <div className="h-28 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-sm text-slate-500">
          Drop a task here
        </div>
      )}
<AnimatePresence>
      {tasks.map((task) => (
        <motion.div
      key={task._id}
      
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
      }}
    >
        <DraggableTask
      
          task={task}
          onClick={() => onTaskClick(task)}
          onDelete={() => onTaskDelete(task._id)}
        />
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
}

export default KanbanColumn
