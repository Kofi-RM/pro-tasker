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
    }).sort({ createdAt: 1 })
     res.json(tasks);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

router.post('/tasks',authMiddleware, async (req, res) => {

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
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.params.projectId,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
})
 

// PUT /api/projects/:projectId/tasks/:taskId - update a task's title, description, or status.
router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({
      _id: taskId,
      project: req.params.projectId,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only allow the editable task fields through.
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
