# Pro Tasker

This application is simple Project/Task manager. You can make many projects and make many tasks within those projects. You can also edit and delete both as you wish.  

Tech Stack

Backend

Node.js
Express.js
MongoDB (Mongoose)

Frontend

React
TypeScript
Vite
Tailwind CSS

Authentication

Email & Password (custom auth)
GitHub OAuth



✨ Features

🔐 Authentication

User sign-up and login using email & password
GitHub OAuth login support
Secure session handling with token-based auth

📁 Project Management

Create multiple projects per user
View all projects in a dashboard
Edit or delete existing projects
Each project can include an optional description

✅ Task Management

Add tasks under specific projects
Update task status (e.g. pending, in progress, completed)
Edit or delete tasks
Optional task descriptions for clarity

🎨 UI/UX

Responsive design for desktop and mobile
Clean dashboard layout using Tailwind CSS
Fast navigation powered by Vite + React Router


Setup

clone repo https://github.com/your-username/pro-tasker.git

For backend go to server folder -> npm install

create .env file with

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

to run "node ./server" 
in /backend

Frontend setup

go to /frontend

npm install


Dependencies

Backend (package.json)

axios ^1.17.0
bcrypt ^6.0.0
cors ^2.8.6
dotenv ^17.4.2
express ^5.2.1
jsonwebtoken ^9.0.3
mongodb ^7.2.0
mongoose ^9.6.3
passport ^0.7.0
passport-github2 ^0.1.12

Frontend (package.json)

@tailwindcss/vite ^4.3.0
axios ^1.17.0
react ^19.2.6
react-dom ^19.2.6
react-router-dom ^7.16.0
tailwindcss ^4.3



# API Endpoints (backend/routes)

This document summarizes the Express routes defined under `backend/routes` and how to use them.

Base mount points (from `server.js`):
- `/api/users` -> `userRoutes.js`
- `/api/projects` -> `projectRoutes.js` (which mounts `taskRoutes.js` at `/:projectId`)

Authentication
- Protected routes require a JWT. The server expects the token in one of:
  - `Authorization: Bearer <token>` header
  - `req.body.token`
  - `req.query.token`
- Tokens are issued by `signToken()` in `backend/util/auth.js` and expire after 2 hours.

-------------------------

Users

1. GET /api/users
- Description: List all users.
- Auth: no
- Params: none
- Body: none
- Response: 200 JSON array of users

2. POST /api/users/register
- Description: Register a new user and receive a JWT.
- Auth: no
- Body: JSON user object (example fields: `email`, `password`, `username`)
- Validations: email must be a valid email address.
- Response: 201 JSON `{ token, user }` on success

3. POST /api/users/login
- Description: Authenticate user with email + password.
- Auth: no
- Body: `{ email, password }`
- Response: 200 JSON `{ token, user }` on success; 400 on missing/wrong credentials

4. GET /api/users/auth/github
- Description: Initiate GitHub OAuth flow (redirects to GitHub).
- Auth: no
- Notes: Uses passport strategy; visits this endpoint in browser to start OAuth.

5. GET /api/users/auth/github/callback
- Description: OAuth callback URL used by GitHub to redirect back to the app.
- Auth: no (handled by passport)
- Behavior: On success, server issues a JWT and redirects to frontend at `http://localhost:5173/oauth-success?token=<token>`

-------------------------

Projects

1. GET /api/projects/
- Description: Get all projects for the authenticated user.
- Auth: yes (JWT)
- Response: 200 JSON array of projects belonging to `req.user._id`

2. POST /api/projects/
- Description: Create a new project for the authenticated user.
- Auth: yes
- Body: project fields (e.g., `title`, `description`)
- Response: 201 JSON `{ project }`

3. GET /api/projects/:projectId
- Description: Get a single project by id. Only the owner can access.
- Auth: yes
- Params: `projectId` URL param
- Responses: 200 project JSON, 404 if not found, 403 if user does not own project

4. PUT /api/projects/:projectId
- Description: Update a project. Only the owner can update.
- Auth: yes
- Body: fields to update (e.g., `title`, `description`)
- Responses: 200 updated project JSON, 404 if not found, 403 if unauthorized

5. DELETE /api/projects/:projectId
- Description: Delete a project. Only owner can delete.
- Auth: yes
- Responses: 200 JSON message on success, 404/403 on error

Nested task routes are mounted under `/api/projects/:projectId` (see Tasks section).

-------------------------

Tasks (mounted at `/api/projects/:projectId` via `projectRoutes`)

1. GET /api/projects/:projectId/tasks
- Description: List all tasks for a project and authenticated user.
- Auth: yes
- Params: `projectId`
- Response: 200 JSON array of tasks

2. POST /api/projects/:projectId/tasks
- Description: Create a new task for the given project.
- Auth: yes
- Body: `{ title, description?, status? }` (status defaults to `not complete`)
- Response: 201 JSON of created task

3. DELETE /api/projects/:projectId/tasks/:taskId
- Description: Delete a task. Only owner of the task may delete.
- Auth: yes
- Params: `projectId`, `taskId`
- Response: 200 JSON of deleted task or error

4. PUT /api/projects/:projectId/tasks/:taskId
- Description: Update a task (title, description, status). Only owner may update.
- Auth: yes
- Body: fields to update
- Response: 200 JSON of updated task

-------------------------

Notes & Tips
- Protected endpoints return `401` when the token is missing or invalid; ownership checks return `403` for unauthorized operations.
- For testing protected endpoints use the token returned from `/api/users/login` or `/api/users/register` and include it in the `Authorization` header: `Authorization: Bearer <token>`.
- When deploying, ensure CORS/allowed origins include your frontend host (see `server.js` `allowedOrigins`).


🧠 Future Improvements
Drag-and-drop task ordering
Due dates & reminders
Light/Dark Mode
