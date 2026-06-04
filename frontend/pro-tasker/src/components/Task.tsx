import { useState } from "react";
import Button from "./Button";

type TaskProps = {
  task: {
    _id: string;
    title: string;
    description?: string;
    completed?: boolean;
  };
  onDelete: (id: string) => void;
  onSave: (
    id: string,
    data: { title: string; description: string }
  ) => void;
};

function Task({ task, onDelete, onSave }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description || ""
  );

  const handleSave = () => {
    onSave(task._id, { title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      {isEditing ? (
        <>
          {/* EDIT MODE */}
          <input
            className="
              w-full
              bg-slate-800
              border border-slate-700
              text-slate-100
              rounded-lg
              px-3 py-2
              mb-3
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500
            "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          

          <div className="flex gap-2">
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>

            <Button variant="danger" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* VIEW MODE */}
          <h3 className="text-slate-50 font-semibold text-lg">
            {task.title}
          </h3>

          <p className="text-slate-400 mt-1">
            {task.description}
          </p>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setIsEditing(true)}>
              Edit
            </Button>

            <Button
              variant="danger"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Task;