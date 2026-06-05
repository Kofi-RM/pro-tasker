import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Modal from "../components/Modal";
import { useAuth } from "../auth/useAuth";
import { useTasks } from "../hooks/useTasks";

import ProjectDetails from "../components/ProjectDetails";
import NewTaskForm from "../components/NewTaskForm";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import Banner from "../components/Banner";
import Button from "../components/Button";

import type { TaskType } from "../type/Task";

function ProjectPage() {
  const { token } = useAuth();
  const { projectId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [project, setProject] = useState(state?.project);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [bannerType, setBannerType] = useState<"success" | "error">("success");

  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessage(text);
    setBannerType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const { tasks, createTask, setTasks, deleteTask } = useTasks(
    projectId,
    token
  );

  if (!token) return <div>Please log in</div>;
  if (!project) return <div>Project not found</div>;

  // UPDATE TASK
  const updateTask = async (
    id: string,
    data: { title: string; description: string; status: string }
  ) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/projects/${projectId}/tasks/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data.task ?? res.data;

      setTasks((current) =>
        current.map((t) => (t._id === id ? updated : t))
      );

      showMessage("Task updated", "success");
    } catch (err) {
      console.error(err);
      showMessage("Failed to update task", "error");
    }
  };

  // DELETE PROJECT
  const deleteProject = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showMessage("Project deleted", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showMessage("Failed to delete project", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">

      {/* SIDEBAR */}
      <aside className="w-80 shrink-0 border-r border-slate-800 p-6 overflow-y-auto">
        <ProjectDetails
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

        <Banner message={message} type={bannerType} />

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-50">
            Tasks
          </h2>

          <Button onClick={() => setShowNewTask(true)}>
            + New Task
          </Button>
        </div>

        {/* TASK GRID */}
        {tasks.length === 0 ? (
          <p className="text-slate-400">No tasks yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            <TaskList
              tasks={tasks}
              onTaskClick={(task) => setSelectedTask(task)}
              onDelete={deleteTask}
            />
          </div>
        )}

        {/* NEW TASK MODAL */}
        <Modal
  isOpen={showNewTask}
  onClose={() => setShowNewTask(false)}
  title="New Task"
>
  <NewTaskForm
    projectId={projectId!}
    token={token}
    showMessage={showMessage}
    onTaskCreated={(task) => {
      createTask(task);
      setShowNewTask(false);
      showMessage("Task created");
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

      </main>
    </div>
  );
}

export default ProjectPage;