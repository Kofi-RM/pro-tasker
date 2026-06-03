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
 
module.exports = router;