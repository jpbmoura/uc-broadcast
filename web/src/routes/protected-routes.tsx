import { Navigate, Outlet, useLocation } from "react-router";
import { FullScreenLoader } from "../components/full-screen-loader";
import { useAuth } from "../features/auth/hooks";

export const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
};
