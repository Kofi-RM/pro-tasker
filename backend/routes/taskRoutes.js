const router = require('express').Router({
  mergeParams: true
});
const  Task  = require('../models/Task');

const {authMiddleware} = require('../util/auth');

router.get("/tasks", authMiddleware, async (req, res) => {
try {
    const tasks = await Task.find({
        user: req.user._id
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
  ...req.body,
  user: req.user._id,
  project: req.params.projectId
});


    res.status(201).json({ task });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});

router.delete("/tasks/:taskId", authMiddleware, (req,res) => {
  const id = req.params.taskId;

    if (task.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
  Task.findByIdAndDelete(taskId)
   .then(task => res.json(task))
    .catch(err => res.status(500).json(err));
})
 
router.post('/task/:taskId', authMiddleware, (req, res) => {
  const { done } = req.body;
  Task.findByIdAndUpdate(req.params.id, { done })
    .then(task => res.json(task))
    .catch(err => res.json(500, err));
});

router.put("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔒 ownership check (important)
    if (task.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✏️ update fields
    task.title = req.body.title ?? task.title;
   

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;