import Task from "./Task";
import type { TaskType } from "../type/Task";
import { useTasks } from "../hooks/useTasks";
import { useParams } from "react-router";
import { useAuth } from "../auth/useAuth";
type TaskListProps = {
  tasks: TaskType[];
  onTaskClick: (task: TaskType) => void;
};

function TaskList({ tasks, onTaskClick }: TaskListProps) {
  const {projectId} = useParams()
  const {token} = useAuth()
  const {deleteTask} = useTasks(projectId, token)
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
          onDelete={() => deleteTask(task._id)}
        />
      ))}
    </>
  );
}

export default TaskList;