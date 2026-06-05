
import './App.css'
import {Routes, Route} from "react-router-dom"
import Login from './nav/Login'
import Dashboard from './nav/Dashboard'
import ProjectPage from './nav/ProjectPage'
import Register from './nav/Register'
import OAuthSuccess from './nav/OAuthSuccess'
import Navbar from './components/NavBar'

function App() {

  return (
    <>
    <Navbar></Navbar>
    <Routes>
          <Route path="/" element={<Login/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
       <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/dashboard/project/:projectId" element={<ProjectPage/>}></Route>

         <Route path="/register" element={<Register/>}></Route>
<Route
  path="/oauth-success"
  element={<OAuthSuccess />}
/>
      
    </Routes>
    </>
  )
}

export default App
