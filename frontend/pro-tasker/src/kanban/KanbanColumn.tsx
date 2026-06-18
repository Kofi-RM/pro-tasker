import type { TaskType } from "../type/Task";
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
  status: string;
  tasks: TaskType[];
  onTaskClick: (task: TaskType) => void;
  onTaskDelete: (taskId: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="
        bg-slate-950
        border border-slate-800
        rounded-xl
        p-4
        min-h-[600px]
      "
    >
      <h3 className="font-bold mb-4">
        {title} ({tasks.length})
      </h3>
<AnimatePresence>
      {tasks.map((task) => (
        <motion.div
      key={task._id}
      layout
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