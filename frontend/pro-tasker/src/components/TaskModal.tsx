// Modal for editing existing task details and status.
import { useState } from "react";
import Button from "./Button";
import type { TaskType } from "../type/Task";

type TaskModalProps = {
  task: TaskType;
  onClose: () => void;
  onSave: (
    id: string,
    data: { title: string; description: string; status: string }
  ) => void;
};

function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [status, setStatus] = useState(task.status);



  const handleSave = () => {
    console.log({ title, description, status });
    onSave(task._id, {
      title,
      description,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-[520px] p-6 space-y-4">

        <h2 className="text-xl font-bold text-slate-100">
          Edit Task
        </h2>

        {/* TITLE */}
        <input
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* STATUS */}
        <select
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="not complete">Not Complete</option>
          <option value="in progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </div>

      </div>
    </div>
  );
}

export default TaskModal;