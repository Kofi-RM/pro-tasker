// Form used inside the project page modal to create a new task.
import { useState } from "react";
import Button from "./Button";
import type { TaskInput, TaskStatus } from "../type/Task";

type NewTaskFormProps = {
  onSubmit: (task: TaskInput) => Promise<void>;
};

function NewTaskForm({
  onSubmit,
}: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("to do");
  const [saving, setSaving] = useState(false);

  const createTask = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void createTask(); }}>
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

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
          aria-label="Initial task status"
        >
          <option value="to do">To do</option>
          <option value="in progress">In progress</option>
          <option value="complete">Complete</option>
        </select>

        <Button
          variant="success"
          type="submit"
          disabled={saving || !title.trim()}
        >
          {saving ? "Creating…" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}

export default NewTaskForm;
