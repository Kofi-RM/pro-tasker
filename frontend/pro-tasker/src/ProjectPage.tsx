import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./auth/useAuth";

import type { ProjectType } from "./type/Project";
import type { TaskType } from "./type/Task";

import Task from "./components/Task";
function ProjectPage() {
  const { token } = useAuth();
  const { state } = useLocation();
  const { projectId } = useParams();

  const [project, setProject] = useState<ProjectType | null>(
    state?.project ?? null
  );
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !projectId) return;

    const loadData = async () => {
      try {
        const requests = [];

        // Only fetch project if we didn't get it from navigation state
        if (!project) {
          requests.push(
            axios.get(
              `http://localhost:3001/api/projects/${projectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          );
        }

        requests.push(
          axios.get(
            `http://localhost:3001/api/projects/${projectId}/tasks`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );

        const responses = await Promise.all(requests);

        if (!project) {
          setProject(responses[0].data);
          setTasks(responses[1].data);
        } else {
          setTasks(responses[0].data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, token]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!project) {
    return <h2>Project not found</h2>;
  }

  const deleteTask = async (taskId: string) => {
  try {
    await axios.delete(
      `http://localhost:3001/api/projects/${projectId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== taskId)
    );
  } catch (err) {
    console.error(err);
  }
};
const saveTask = async (
  taskId: string,
  updated: { title: string; }
) => {
  const res = await axios.put(
    `http://localhost:3001/api/projects/${projectId}/tasks/${taskId}`,
    updated,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setTasks((prev) =>
    prev.map((t) =>
      t._id === taskId ? res.data : t
    )
  );
};

  return (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          <div>
           <h1 className="text-4xl font-bold text-slate-50 tracking-tight">
  {project.title}
</h1>

            <p className="text-slate-400 mt-3 text-lg">
              {project.description}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="
                px-5 py-2.5
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-500
                transition
                font-medium
              "
            >
              Edit Project
            </button>

            <button
              className="
                px-5 py-2.5
                rounded-xl
                bg-rose-600
                hover:bg-rose-500
                transition
                font-medium
              "
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Tasks
          </h2>

          <p className="text-slate-400">
            Manage project work and progress
          </p>
        </div>

        <button
          className="
            px-5 py-2.5
            rounded-xl
            bg-gradient-to-r
            from-indigo-600
            to-cyan-500
            hover:opacity-90
            transition
            font-medium
          "
        >
          + New Task
        </button>
      </div>

      <div className="mt-6">
        {tasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-300">
              No Tasks Yet
            </h3>

            <p className="text-slate-500 mt-2">
              Create your first task to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Task
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onSave={saveTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);;
}

export default ProjectPage;