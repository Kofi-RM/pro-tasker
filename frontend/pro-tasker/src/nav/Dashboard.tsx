import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/useAuth";
import type { ProjectType } from "../type/Project";
import Project from "../components/Project";

function Dashboard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const { token } = useAuth();

  const [showNewProject, setShowNewProject] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  const createProject = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/projects",
        {
          title: newTitle,
          description: newDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((prev) => [res.data, ...prev]);
      setNewTitle("");
      setNewDescription("");
      setShowNewProject(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER (BEST UX: LEFT ALIGNED) */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">
              Your Projects
            </h1>

            <p className="text-slate-400 mt-2">
              Organize, track, and complete your work.
            </p>
          </div>

          <button
            onClick={() => setShowNewProject(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
          >
            + Add Project
          </button>
        </div>

        {/* MODAL */}
        {showNewProject && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowNewProject(false)}
          >
            <div
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-100">
                  New Project
                </h2>

                <button
                  onClick={() => setShowNewProject(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                  placeholder="Project title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />

                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                  placeholder="Project description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />

                <button
                  onClick={createProject}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 text-sm font-medium"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <h2 className="text-xl font-semibold text-slate-200">
              No projects yet
            </h2>

            <p className="text-slate-400 mt-2">
              Create your first project to get started.
            </p>

            <button
              onClick={() => setShowNewProject(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
            >
              + Create Project
            </button>
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