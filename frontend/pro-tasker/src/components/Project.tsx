type ProjectProps = {
  project: {
    _id: string;
    title: string;
    description?: string;
  };
};

import { useNavigate } from "react-router-dom";



const Project = ({ project }: ProjectProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/dashboard/project/${project._id}`, {
          state: { project },
        })
      }
      className="
        group
        cursor-pointer
        bg-slate-900/70
        hover:bg-slate-900
        border
        border-slate-800
        hover:border-indigo-500/50
        rounded-2xl
        p-5
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-indigo-500/10
      "
    >
      {/* Title */}
      <h3 className="
        text-lg
        font-semibold
        text-slate-50
        group-hover:text-indigo-300
        transition
      ">
        {project.title}
      </h3>

      {/* Description */}
      <p className="
        text-slate-400
        mt-2
        line-clamp-2
      ">
        {project.description || "No description provided."}
      </p>

      {/* Footer hint */}
      <div className="mt-4 text-xs text-slate-500 flex justify-between">
        <span>Click to view tasks</span>
        <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition">
          →
        </span>
      </div>
    </div>
  );
};

export default Project;