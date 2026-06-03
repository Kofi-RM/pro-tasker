import { useEffect } from "react"
import axios from "axios"
import { useAuth } from "./auth/useAuth"
function Dashboard() {
    const {token} = useAuth()
  useEffect(() => {
  const getProjects = async () => {
    const res = await axios.get("http://localhost:3001/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);
  };

  getProjects();
}, [token]);
    return (
        <>
        </>
    )
}

export default Dashboard