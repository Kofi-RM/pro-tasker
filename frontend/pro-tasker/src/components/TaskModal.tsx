// Modal for editing existing task details and status.
import { useState } from "react";
import Button from "./Button";
import type { TaskInput, TaskStatus, TaskType } from "../type/Task";

type TaskModalProps = {
  task: TaskType;
  onClose: () => void;
  onSave: (id: string, data: TaskInput) => Promise<void>;
};

function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [saving, setSaving] = useState(false);



  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave(task._id, {
        title: title.trim(),
        description: description.trim(),
        status,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">

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
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="to do">To do</option>
          <option value="in progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>

          <Button variant="success" onClick={() => void handleSave()} disabled={saving || !title.trim()}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>

    </div>
  );
}

export default TaskModal;
