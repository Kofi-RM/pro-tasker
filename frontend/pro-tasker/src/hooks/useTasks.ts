// Custom hook that loads and mutates tasks for a specific project.
import { useEffect, useState } from "react";
import api from "../api/axios";
import type { TaskType } from "../type/Task";

export function useTasks(projectId: string, token: string | null  ) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);

  // GET TASKS
  useEffect(() => {
    if (!projectId || !token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/api/projects/${projectId}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTasks(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, token]);

  // CREATE TASK
  const createTask = async (data: {
    title: string;
    description: string;
    status:string
  }) => {
    const res = await api.post(
      `/api/projects/${projectId}/tasks`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks((prev) => [...prev, res.data]);
  };

  // DELETE TASK
  const deleteTask = async (taskId: string) => {
    await api.delete(
      `/api/projects/${projectId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks((prev) =>
      prev.filter((t) => t._id !== taskId)
    );
  };

  // UPDATE TASK
  // const updateTask = async (
  //   taskId: string,
  //   updated: {
  //     title: string;
  //     description: string;
  //   }
  // ) => {
  //   const res = await axios.put(
  //     `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks/${taskId}`,
  //     updated,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   setTasks((prev) =>
  //     prev.map((t) =>
  //       t._id === taskId ? res.data : t
  //     )
  //   );
  // };

  return {
    tasks,
    loading,
    createTask,
    deleteTask,
   
    setTasks,
  };
}