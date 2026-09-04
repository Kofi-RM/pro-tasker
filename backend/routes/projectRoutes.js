// Routes for project CRUD operations.
// All project routes are protected and require a valid JWT.
const router = require('express').Router();
const  Project  = require('../models/Project');
const Task = require('../models/Task');
const taskRoutes = require("./taskRoutes")
const {authMiddleware} = require("../util/auth")

// GET /api/projects - return all projects for the logged in user
router.get("/", authMiddleware,  async (req, res) => {
try {
    const projects = await Project.find({
        user: req.user._id
    })
     res.json(projects);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

// make project
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

// get indivual project
router.get("/:projectId", authMiddleware, async (req, res) => {
const project = await Project.findById(req.params.projectId)

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
res.json(project)
})

 // update project
router.put("/:projectId", authMiddleware, async (req, res) => {
const project = await Project.findById(req.params.projectId)

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
    project.description = req.body.description ?? project.description;

        const updatedProject = await project.save();

    res.json(updatedProject);
})

// delete project
router.delete('/:projectId', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized'
      });
    }

    await Project.findByIdAndDelete(req.params.projectId);
    await Task.deleteMany({ project: req.params.projectId, user: req.user._id });

    res.json({
      message: 'Project deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Mount task routes under /api/projects/:projectId.
// mergeParams in the task router will preserve projectId for task APIs.
router.use("/:projectId", authMiddleware, taskRoutes);
module.exports = router;
