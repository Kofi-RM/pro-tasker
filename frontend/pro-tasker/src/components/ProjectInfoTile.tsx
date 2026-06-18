// Sidebar panel for viewing and editing project metadata.
import { useState } from "react";
import axios from "axios";
import Button from "./Button";
import type { ProjectType } from "../type/Project";

type ProjectInfoProps = {
  project: ProjectType;
  token: string | null;
  onProjectUpdated: (project: ProjectType) => void;
  showMessage: (message: string) => void;
};

function ProjectInfoTile({
  project,
  token,
  onProjectUpdated,
  showMessage,
}: ProjectInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(
    project.description || ""
  );
 
    
  const saveProject = async () => {
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  // Nothing changed
  if (
    trimmedTitle === project.title &&
    trimmedDescription === (project.description || "")
  ) {
    showMessage("No changes to save");
    setIsEditing(false);
    return;
  }

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/projects/${project._id}`,
      {
        title: trimmedTitle,
        description: trimmedDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    onProjectUpdated(res.data);
    setIsEditing(false);

    showMessage("Project updated successfully");
  } catch (err) {
    console.error(err);
    showMessage("Failed to update project");
  }
};

  const cancelEdit = () => {
    setTitle(project.title);
    setDescription(project.description || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 shadow-xl">
      {isEditing ? (
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

          <div className="flex gap-2">
            <Button
              variant="success"
              onClick={saveProject}
            >
              Save
            </Button>

            <Button
              variant="danger"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight m-4">
            {project.title}
          </h1>

          <p className="text-slate-300 m-2">
            {project.description}
          </p>

         <div className="mt-6 flex justify-center">
  <div className="flex gap-2">
    <Button onClick={() => setIsEditing(true)}>
      Edit Project
    </Button>
  </div>
</div>
        </>
      )}
    </div>
  );
}

export default ProjectInfoTile;