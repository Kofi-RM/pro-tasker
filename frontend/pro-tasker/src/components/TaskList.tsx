// List wrapper for Task cards. Delegates each task to the Task component.
import Task from "./Task";
import type { TaskType } from "../type/Task";


type TaskListProps = {
  tasks: TaskType[];
  onTaskClick: (task: TaskType) => void;
  onDelete: (id: string) => void;
};

function TaskList({ tasks, onTaskClick, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl p-8 text-center">
        <p className="text-slate-400">No tasks yet.</p>
      </div>
    );
  }

  return (
    <>
      {tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          onClick={() => onTaskClick(task)}
          onDelete={() => onDelete(task._id)}
        />
      ))}
    </>
  );
}

export default TaskList;