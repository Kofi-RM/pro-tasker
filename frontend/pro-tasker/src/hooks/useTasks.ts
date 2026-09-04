// Custom hook that owns all task API calls and local task state for a project.
import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import type { TaskInput, TaskStatus, TaskType } from "../type/Task";

export function useTasks(projectId: string, token: string | null  ) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async (signal?: AbortSignal) => {
    if (!projectId || !token) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.get<TaskType[]>(`/api/projects/${projectId}/tasks`, {
        signal,
      });
      setTasks(res.data);
    } catch (requestError) {
      if (!signal?.aborted) {
        console.error(requestError);
        setError("Tasks could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [projectId, token]);

  useEffect(() => {
    const controller = new AbortController();
    // Defer the request so the effect only synchronizes with the external API.
    void Promise.resolve().then(() => fetchTasks(controller.signal));
    return () => controller.abort();
  }, [fetchTasks]);

  // CREATE TASK
  const createTask = async (data: TaskInput) => {
    const res = await api.post<TaskType>(`/api/projects/${projectId}/tasks`, data);

    setTasks((prev) => [...prev, res.data]);
    return res.data;
  };

  // DELETE TASK
  const deleteTask = async (taskId: string) => {
    await api.delete(`/api/projects/${projectId}/tasks/${taskId}`);

    setTasks((prev) =>
      prev.filter((t) => t._id !== taskId)
    );
  };

  const updateTask = async (taskId: string, data: TaskInput) => {
    const res = await api.put<TaskType>(
      `/api/projects/${projectId}/tasks/${taskId}`,
      data
    );
    setTasks((prev) => prev.map((task) => task._id === taskId ? res.data : task));
    return res.data;
  };

  // Moving feels immediate, but rolls back if persistence fails.
  const moveTask = async (taskId: string, status: TaskStatus) => {
    const previousTask = tasks.find((task) => task._id === taskId);
    if (!previousTask || previousTask.status === status) return false;

    setTasks((prev) => prev.map((task) =>
      task._id === taskId ? { ...task, status } : task
    ));

    try {
      const res = await api.put<TaskType>(
        `/api/projects/${projectId}/tasks/${taskId}`,
        { status }
      );
      setTasks((prev) => prev.map((task) => task._id === taskId ? res.data : task));
      return true;
    } catch (requestError) {
      setTasks((prev) => prev.map((task) =>
        task._id === taskId ? previousTask : task
      ));
      throw requestError;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    deleteTask,
    updateTask,
    moveTask,
    refetch: fetchTasks,
  };
}
