import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./auth/useAuth";
import type { ProjectType } from "./type/Project";
import Project from "./components/Project";

function Dashboard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const getProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    getProjects();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">
            Your Projects
          </h1>

          <p className="text-slate-400 mt-2">
            Organize, track, and complete your work.
          </p>
        </div>

        {/* Content */}
        {projects.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-200">
              No projects yet
            </h2>

            <p className="text-slate-400 mt-2">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Project
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;