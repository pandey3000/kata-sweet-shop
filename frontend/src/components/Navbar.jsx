import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 px-6 py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          🍬 Sweet Shop
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>

          {user ? (
            <>
              {/* Show Admin link only if user logic allows (optional improvement later) */}
              <Link to="/admin" className="hover:text-blue-200">
                Admin Panel
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-sm opacity-80">Hello!</span>
                <button
                  onClick={handleLogout}
                  className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded bg-white px-4 py-2 font-bold text-blue-600 hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
