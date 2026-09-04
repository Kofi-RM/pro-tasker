import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import api from "../api/axios";
import isTokenExpired from "../auth/tokenCheck";
import { useAuth } from "../auth/useAuth";
import Banner from "../components/Banner";
import Button from "../components/Button";
import Modal from "../components/Modal";
import NewTaskForm from "../components/NewTaskForm";
import ProjectInfoTile from "../components/ProjectInfoTile";
import TaskModal from "../components/TaskModal";
import { useViewMode } from "../context/ViewMode";
import { useTasks } from "../hooks/useTasks";
import KanbanColumn from "../kanban/KanbanColumn";
import type { ProjectType } from "../type/Project";
import type { TaskInput, TaskStatus, TaskType } from "../type/Task";

const statuses: TaskStatus[] = ["to do", "in progress", "complete"];

function ProjectPage() {
  const { token, logout } = useAuth();
  const { projectId = "" } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialProject = (state as { project?: ProjectType } | null)?.project ?? null;

  const [project, setProject] = useState<ProjectType | null>(initialProject);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [bannerType, setBannerType] = useState<"success" | "error">("success");
  const messageTimer = useRef<number | null>(null);
  const { viewMode, setViewMode } = useViewMode();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const showMessage = useCallback((text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setBannerType(type);
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(""), 3000);
  }, []);

  useEffect(() => () => {
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
  }, []);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [token, logout, navigate]);

  // Direct links do not have router state, so load the project when needed.
  useEffect(() => {
    if (!token || !projectId || project?._id === projectId) return;
    const controller = new AbortController();

    api.get<ProjectType>(`/api/projects/${projectId}`, { signal: controller.signal })
      .then((response) => setProject(response.data))
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          console.error(requestError);
          showMessage("Project could not be loaded", "error");
        }
      });

    return () => controller.abort();
  }, [projectId, project?._id, showMessage, token]);

  const {
    tasks,
    loading,
    error,
    createTask,
    deleteTask,
    updateTask,
    moveTask,
    refetch,
  } = useTasks(projectId, token);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter((task) =>
      `${task.title} ${task.description}`.toLowerCase().includes(query)
    );
  }, [search, tasks]);

  const tasksByStatus = useMemo(() => ({
    "to do": filteredTasks.filter((task) => task.status === "to do"),
    "in progress": filteredTasks.filter((task) => task.status === "in progress"),
    complete: filteredTasks.filter((task) => task.status === "complete"),
  }), [filteredTasks]);

  const completedCount = tasks.filter((task) => task.status === "complete").length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const status = (over.data.current?.status ?? over.id) as TaskStatus;
    if (!statuses.includes(status)) return;

    try {
      const moved = await moveTask(String(active.id), status);
      if (moved) showMessage(`Moved to ${status}`);
    } catch (requestError) {
      console.error(requestError);
      showMessage("Move failed — the task was put back", "error");
    }
  };

  const handleCreateTask = async (data: TaskInput) => {
    try {
      await createTask(data);
      setShowNewTask(false);
      showMessage("Task created");
    } catch (requestError) {
      console.error(requestError);
      showMessage("Failed to create task", "error");
    }
  };

  const handleUpdateTask = async (id: string, data: TaskInput) => {
    const currentTask = tasks.find((task) => task._id === id);
    if (!currentTask) return;
    if (
      currentTask.title === data.title &&
      currentTask.description === data.description &&
      currentTask.status === data.status
    ) {
      showMessage("No changes made");
      return;
    }

    try {
      const updated = await updateTask(id, data);
      setSelectedTask(updated);
      showMessage("Task updated");
    } catch (requestError) {
      console.error(requestError);
      showMessage("Failed to update task", "error");
      throw requestError;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      showMessage("Task deleted");
    } catch (requestError) {
      console.error(requestError);
      showMessage("Failed to delete task", "error");
    }
  };

  const deleteProject = async () => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      showMessage("Failed to delete project", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 p-6">
        {project ? (
          <ProjectInfoTile
            key={project._id}
            project={project}
            token={token}
            onProjectUpdated={setProject}
            showMessage={showMessage}
          />
        ) : (
          <div className="h-48 animate-pulse rounded-3xl bg-slate-900" />
        )}
        <div className="mt-6">
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} disabled={!project}>
            Delete Project
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-6 py-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-50">Tasks</h2>
            <p className="text-sm text-slate-400 mt-1">{completedCount} of {tasks.length} complete · {progress}%</p>
          </div>
          <Banner message={message} type={bannerType} />
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks…"
              aria-label="Search tasks"
              className="min-w-48 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex gap-1">
              <Button variant={viewMode === "tiles" ? "primary" : "ghost"} onClick={() => setViewMode("tiles")} className="px-3 py-1 text-xs">Board</Button>
              <Button variant={viewMode === "list" ? "primary" : "ghost"} onClick={() => setViewMode("list")} className="px-3 py-1 text-xs">List</Button>
            </div>
            <Button onClick={() => setShowNewTask(true)}>+ New Task</Button>
          </div>
        </div>

        <div className="h-2 bg-slate-900 rounded-full overflow-hidden mb-6" aria-label={`${progress}% complete`}>
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {loading ? (
          <div className="py-20 text-slate-400">Loading tasks…</div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-rose-400 mb-4">{error}</p>
            <Button onClick={() => void refetch()}>Try again</Button>
          </div>
        ) : viewMode === "tiles" ? (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid md:grid-cols-3 gap-5 text-left">
              <KanbanColumn title="To Do" status="to do" tasks={tasksByStatus["to do"]} onTaskClick={setSelectedTask} onTaskDelete={(id) => void handleDeleteTask(id)} />
              <KanbanColumn title="In Progress" status="in progress" tasks={tasksByStatus["in progress"]} onTaskClick={setSelectedTask} onTaskDelete={(id) => void handleDeleteTask(id)} />
              <KanbanColumn title="Complete" status="complete" tasks={tasksByStatus.complete} onTaskClick={setSelectedTask} onTaskDelete={(id) => void handleDeleteTask(id)} />
            </div>
          </DndContext>
        ) : filteredTasks.length ? (
          <div className="flex flex-col gap-2 text-left">
            {filteredTasks.map((task) => (
              <button key={task._id} onClick={() => setSelectedTask(task)} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition flex items-center justify-between gap-4 text-left">
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-100 truncate">{task.title}</h3>
                  {task.description && <p className="text-sm text-slate-400 truncate">{task.description}</p>}
                </div>
                <span className="shrink-0 text-xs capitalize px-2 py-1 rounded bg-slate-800 text-slate-300">{task.status}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-20 text-slate-400">{search ? "No tasks match your search." : "No tasks yet. Create your first task."}</div>
        )}

        <Modal isOpen={showNewTask} onClose={() => setShowNewTask(false)} title="New Task">
          <NewTaskForm onSubmit={handleCreateTask} />
        </Modal>

        <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Edit Task">
          {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleUpdateTask} />}
        </Modal>

        <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Project" size="sm">
          <p className="text-sm text-slate-400">This deletes the project and all of its tasks. This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => void deleteProject()}>Delete</Button>
          </div>
        </Modal>

        <button onClick={() => navigate("/dashboard")} aria-label="Back to dashboard" className="fixed bottom-6 right-6 z-40 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 px-4 py-3 rounded-full shadow-lg transition">←</button>
      </main>
    </div>
  );
}

export default ProjectPage;
