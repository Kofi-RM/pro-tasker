// Project detail page. Shows project metadata, task list, and task management actions.
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

import Modal from "../components/Modal";
import { useAuth } from "../auth/useAuth";
import { useTasks } from "../hooks/useTasks";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "../kanban/KanbanColumn";
import ProjectInfoTile from "../components/ProjectInfoTile";
import NewTaskForm from "../components/NewTaskForm";

import TaskModal from "../components/TaskModal";
import Banner from "../components/Banner";
import Button from "../components/Button";

import { useViewMode } from "../context/ViewMode";

import type { TaskType } from "../type/Task";
import isTokenExpired from "../auth/tokenCheck";



// start projectPage
function ProjectPage() {
const { token,logout } = useAuth();
    let {  projectId } = useParams();
    if(!projectId) projectId=""
  const { state } = useLocation();
  const navigate = useNavigate();

  const [project, setProject] = useState(state?.project);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [bannerType, setBannerType] = useState<"success" | "error">("success");

const { viewMode, setViewMode } = useViewMode()

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 6, // 👈 prevents accidental / sticky drag
    },
  })
);

  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessage(text);
    setBannerType(type);
    setTimeout(() => setMessage(""), 3000);
  };
useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  if (isTokenExpired(token)) {
    logout();
  }
}, [token, logout, navigate]);


  // Custom hook loads tasks for the current project and exposes mutation helpers.
  const { tasks, createTask, setTasks, deleteTask } = useTasks(
    projectId,
    token
  );

const todoTasks = tasks.filter(
  (t) => t.status === "to do"
);

const inProgressTasks = tasks.filter(
  (t) => t.status === "in progress"
);

const completeTasks = tasks.filter(
  (t) => t.status === "complete"
);


const handleDragEnd = async (
  event: DragEndEvent
) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id as string;
  const newStatus = over.id as string;

  const task = tasks.find(
    (t) => t._id === taskId
  );

  if (!task) return;

  if (task.status === newStatus) return;

  try {
    const res = await api.put(
      `/api/projects/${projectId}/tasks/${taskId}`,
      {
        title: task.title,
        description: task.description,
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks((current) =>
      current.map((t) =>
        t._id === taskId ? res.data : t
      )
    );

    showMessage("Task moved");
  } catch (err) {
    console.error(err);
    showMessage("Failed to move task", "error");
  }
};


  // UPDATE TASK: only call the API if task data actually changed.
  const updateTask = async (
  id: string,
  data: { title: string; description: string; status: string }
) => {
  try {
    // find current task from state
    const currentTask = tasks.find((t) => t._id === id);

    if (!currentTask) return;

    // check if anything actually changed
    const isUnchanged =
      currentTask.title === data.title &&
      currentTask.description === data.description &&
      currentTask.status === data.status;

    if (isUnchanged) {
     showMessage("No changes made", "success");
      return;
    }

    // only call API if something changed
    const res = await api.put(
      `/api/projects/${projectId}/tasks/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks((current) =>
      current.map((task) =>
        task._id === id ? res.data : task
      )
    );

    showMessage("Task updated", "success");
  } catch (err) {
    console.error(err);
    showMessage("Failed to update task", "error");
  }
};

  // DELETE PROJECT: remove the project and navigate back to dashboard.
  const deleteProject = async () => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showMessage("Project deleted", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      showMessage("Failed to delete project", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">

      {/* SIDEBAR */}
      <aside className="w-80 shrink-0 border-r border-slate-800 p-6 overflow-y-auto">
        <ProjectInfoTile
          project={project}
          token={token}
          onProjectUpdated={setProject}
          showMessage={showMessage}
        />

        <div className="mt-6">
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Project
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 px-6 py-10">

       

        {/* HEADER */}
       <div className="flex items-center justify-between mb-6">
        
  <h2 className="text-3xl font-bold text-slate-50">
    Tasks
  </h2>
 <Banner message={message} type={bannerType} />
  <div className="flex items-center gap-3">

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex gap-1">

      <Button
        variant={viewMode === "tiles" ? "primary" : "ghost"}
        onClick={() => setViewMode("tiles")}
        className="px-3 py-1 text-xs"
      >
        Tiles
      </Button>

      <Button
        variant={viewMode === "list" ? "primary" : "ghost"}
        onClick={() => setViewMode("list")}
        className="px-3 py-1 text-xs"
      >
        List
      </Button>

    </div>

    <Button onClick={() => setShowNewTask(true)}>
      + New Task
    </Button>

  </div>
</div>

        {/* TASK GRID */}
       {tasks.length === 0 ? (
  <p className="text-slate-400">No tasks yet.</p>
) : viewMode === "tiles" ? (
  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    <div className="grid md:grid-cols-3 gap-6">

      <KanbanColumn
        title="To Do"
        status="to do"
        tasks={todoTasks}
        onTaskClick={setSelectedTask}
        onTaskDelete={deleteTask}
      />

      <KanbanColumn
        title="In Progress"
        status="in progress"
        tasks={inProgressTasks}
        onTaskClick={setSelectedTask}
        onTaskDelete={deleteTask}
      />

      <KanbanColumn
        title="Complete"
        status="complete"
        tasks={completeTasks}
        onTaskClick={setSelectedTask}
        onTaskDelete={deleteTask}
      />

    </div>
  </DndContext>
)  : (

  <div className="flex flex-col gap-2">

    {tasks.map((task) => (
      <div
        key={task._id}
        onClick={() => setSelectedTask(task)}
        className="
          bg-slate-900
          border border-slate-800
          rounded-xl
          p-4
          cursor-pointer
          hover:border-slate-700
          transition
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h3 className="font-medium text-slate-100">
            {task.title}
          </h3>

          <p className="text-sm text-slate-400">
            {task.description}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            task.status === "complete"
              ? "bg-green-500/20 text-green-400"
              : task.status === "in progress"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {task.status}
        </span>
      </div>
    ))}

  </div>

)}
        {/* NEW TASK MODAL */}
        <Modal
  isOpen={showNewTask}
  onClose={() => setShowNewTask(false)}
  title="New Task"
>
  <NewTaskForm
    projectId={projectId}
    token={token}
    showMessage={showMessage}
    onTaskCreated={(task) => {
      createTask(task);
      setShowNewTask(false);
      
    }}
  />
</Modal>

        {/* TASK EDIT MODAL */}
        <Modal
  isOpen={!!selectedTask}
  onClose={() => setSelectedTask(null)}
  title="Edit Task"
>
  {selectedTask && (
    <TaskModal
      task={selectedTask}
      onClose={() => setSelectedTask(null)}
      onSave={updateTask}
    />
  )}
</Modal>

        {/* DELETE CONFIRM MODAL */}
        <Modal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  title="Delete Project"
  size="sm"
>
  <p className="text-sm text-slate-400">
    This action cannot be undone.
  </p>

  <div className="flex justify-end gap-2 mt-5">
    <Button onClick={() => setShowDeleteConfirm(false)}>
      Cancel
    </Button>

    <Button variant="danger" onClick={deleteProject}>
      Delete
    </Button>
  </div>
</Modal>
<button
  onClick={() => navigate("/dashboard")}
  className="
    fixed
    bottom-6
    right-6
    z-50
    bg-slate-800
    hover:bg-slate-700
    border border-slate-700
    text-slate-100
    px-4
    py-3
    rounded-full
    shadow-lg
    transition
  "
>
  ←
</button>
      </main>
      
    </div>
  );
}

export default ProjectPage;