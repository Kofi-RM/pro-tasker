import { useState } from "react";
import axios from "axios";
import Button from "./Button";

import type { TaskType } from "../type/Task";

type NewTaskFormProps = {
  projectId: string;
  token: string;
  onTaskCreated: (task: TaskType) => void;
  showMessage: (message: string) => void;
};

function NewTaskForm({
  projectId,
  token,
  onTaskCreated,
  showMessage,
}: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const createTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3001/api/projects/${projectId}/tasks`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskCreated(res.data);

      setTitle("");
      setDescription("");

      showMessage("Task created");
    } catch (err) {
      console.error(err);
      showMessage("Failed to create task");
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-slate-50 mb-4">
        New Task
      </h2>

      <div className="space-y-3">
        <input
          value={title}
          placeholder="Task title"
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="
            w-full
            bg-slate-800
            border border-slate-700
            rounded-xl
            px-4 py-3
            text-slate-100
          "
        />

        <textarea
          value={description}
          placeholder="Description"
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="
            w-full
            bg-slate-800
            border border-slate-700
            rounded-xl
            px-4 py-3
            text-slate-100
          "
        />

        <Button
          variant="success"
          onClick={createTask}
        >
          Create Task
        </Button>
      </div>
    </div>
  );
}

export default NewTaskForm;