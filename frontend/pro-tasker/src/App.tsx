
import './App.css'
import {Routes, Route} from "react-router-dom"
import Login from './Login'
import Dashboard from './Dashboard'
import ProjectPage from './ProjectPage'
import Register from './Register'
import OAuthSuccess from './OAuthSuccess'
import Navbar from './NavBar'

function App() {

  return (
    <>
    <Navbar></Navbar>
    <Routes>
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
