
type ProjectProps = {
  project: {
    _id: string;
    title: string;
    description?: string;
  };
};

import { useNavigate } from "react-router-dom";



const ProjectList = ({ project }: ProjectProps) => {
  const navigate = useNavigate();




    return(
        <>
        
         <div
         key={project._id}
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
        <div>
          <h3 className="text-slate-100 font-semibold">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm">
            {project.description}
          </p>
        </div>

        <div className="text-xs text-slate-500">
          →
        </div>
 </div>     

        </>
    )
}

export default ProjectList