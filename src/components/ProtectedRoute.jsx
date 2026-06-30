import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Show a loading screen while checking localStorage for an active session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🌾</span>
          <p className="text-emerald-700 font-medium tracking-wide">
            កំពុងពិនិត្យសិទ្ធិចូលប្រើប្រាស់...
          </p>
        </div>
      </div>
    );
  }

  // 2. If the visitor is NOT logged in, kick them back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If a list of allowedRoles is provided, check if the user has the required permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are unauthorized (e.g., a customer trying to look at a farmer dashboard), boot them to home
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, render the protected component safely
  return children;
};

export default ProtectedRoute;
