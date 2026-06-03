const router = require('express').Router();
const  Project  = require('../models/Project');

router.get("/", async (req, res) => {
try {
    const projects = Project.find()
     res.json(users);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
   
    res.status(201).json({ project });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});
 
module.exports = router;