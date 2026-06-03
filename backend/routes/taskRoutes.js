const router = require('express').Router();
const  Task  = require('../models/Task');

const {authMiddleware} = require('../util/auth');

router.get("/", authMiddleware, async (req, res) => {
try {
    const tasks = Task.find()
     res.json(users);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

router.post('/',authMiddleware, async (req, res) => {
  try {
   const task = await Task.create({
  ...req.body,
  user: req.user._id,
  project: req.params.id
});
    res.status(201).json({ task });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});
 
module.exports = router;