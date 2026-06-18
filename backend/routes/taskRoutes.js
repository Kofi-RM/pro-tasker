// Task routes for a specific project.
// These are mounted under /api/projects/:projectId.
const router = require('express').Router({
  mergeParams: true
});
const  Task  = require('../models/Task');

const {authMiddleware} = require('../util/auth');

// GET /api/projects/:projectId/tasks - list tasks for the current project.
router.get("/tasks", authMiddleware, async (req, res) => {
  const projectId = req.params.projectId
try {
    const tasks = await Task.find({
        user: req.user._id,
        project: projectId
    })
     res.json(tasks);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

router.post('/tasks',authMiddleware, async (req, res) => {

  console.log(req.params.projectId)
     try {
      const task = await Task.create({
        title: req.body.title,
        description: req.body.description || "",
        status: req.body.status || "to do",
        project: req.params.projectId,
        user: req.user._id,
      });

      return res.status(201).json(task);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
});

router.delete("/tasks/:taskId", authMiddleware, async (req,res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  // Only the owner of the task can delete it.
  if (task.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

  Task.findByIdAndDelete(taskId)
   .then(task => res.json(task))
    .catch(err => res.status(500).json(err));
})
 

// PUT /api/projects/:projectId/tasks/:taskId - update a task's title, description, or status.
router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔒 ownership check (important)
    if (task.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized ffsdfasd" });
    }

    // ✏️ update fields
    task.title = req.body.title ?? task.title;
   task.description = req.body.description ?? task.description;
   task.status = req.body.status ?? task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;