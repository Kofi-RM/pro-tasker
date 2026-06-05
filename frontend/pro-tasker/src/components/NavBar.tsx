import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
    
          className="text-2xl font-bold text-slate-50"
        >
          <Link to="http://localhost:5173/dashboard">
          <span className="text-cyan-400">Pro</span> Tasker
        </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {token && (
            <>
              

              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white transition"
              >
                Dashboard
              </Link>
            </>
          )}

          {/* Auth Button */}
          {token ? (
            <Button variant="danger" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;