import { Navigate, Outlet, useLocation } from "react-router";
import { FullScreenLoader } from "../components/full-screen-loader";
import { useAuth } from "../features/auth/hooks";

const redirectTarget = (state: unknown) =>
  typeof state === "object" &&
  state !== null &&
  "from" in state &&
  typeof state.from === "string"
    ? state.from
    : "/connections";

export const PublicRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  return user ? (
    <Navigate to={redirectTarget(location.state)} replace />
  ) : (
    <Outlet />
  );
};
