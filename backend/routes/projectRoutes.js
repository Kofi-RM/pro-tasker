const router = require('express').Router();
const  Project  = require('../models/Project');
const taskRoutes = require("./taskRoutes")
const {authMiddleware} = require("../util/auth")
router.get("/", authMiddleware,  async (req, res) => {
try {
    const projects = await Project.find({
        user: req.user._id
    })
    console.log(projects)
     res.json(projects);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
        ...req.body,
        user: req.user._id
  });
   
    res.status(201).json({ project });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});
 
router.put("/:id", authMiddleware, async (req, res) => {
const project = await Project.findById(req.params.id)

  if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({
        message: 'Unauthorized'
      });
    }

     project.title = req.body.title || project.title;
    project.description = req.body.description || project.url;

        const updatedProject = await project.save();

    res.json(updatedProject);
})

router.use("/:id", authMiddleware, taskRoutes)
module.exports = router;