import { useEffect, useState } from "react";
import axios from "axios";
import type { TaskType } from "../type/Task";

export function useTasks(projectId?: string, token?: string) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);

  const showAuth = !!projectId && !!token;

  // GET TASKS
  useEffect(() => {
    if (!showAuth) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:3001/api/projects/${projectId}/tasks`,
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
    const res = await axios.post(
      `http://localhost:3001/api/projects/${projectId}/tasks`,
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
    await axios.delete(
      `http://localhost:3001/api/projects/${projectId}/tasks/${taskId}`,
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
  //     `http://localhost:3001/api/projects/${projectId}/tasks/${taskId}`,
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