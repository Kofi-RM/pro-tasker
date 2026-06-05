// Top navigation bar that shows login/logout controls based on auth state.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Button from "./Button";

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


const handleLogoClick = () => {
  if (token) {
    navigate("/dashboard");
  } else {
    navigate("/login");
  }
};

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="text-2xl font-bold text-slate-50 cursor-pointer"
        >
          <span className="text-cyan-400">Pro</span> Tasker
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {token && (
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white transition"
            >
              Dashboard
            </Link>
          )}

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