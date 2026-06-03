
import './App.css'
import {Routes, Route} from "react-router-dom"
import Login from './Login'
import Dashboard from './Dashboard'
import ProjectPage from './ProjectPage'
import Register from './Register'
import Task from './Task'
function App() {

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
       <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/project/:projectId" element={<ProjectPage/>}></Route>
          <Route path="/project/:projectId/:taskId" element={<Task/>}></Route>
         <Route path="/register" element={<Register/>}></Route>

      
    </Routes>
    </>
  )
}

export default App
