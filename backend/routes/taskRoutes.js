const router = require('express').Router();
const  Task  = require('../models/Task');


router.get("/", async (req, res) => {
try {
    const tasks = Task.find()
     res.json(users);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
   
    res.status(201).json({ task });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});
 
module.exports = router;