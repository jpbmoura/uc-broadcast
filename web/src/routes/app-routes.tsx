import { Typography } from "@mui/material";
import { Navigate, Route, Routes } from "react-router";
import { LoginPage } from "../features/auth/components/login-page";
import { SignUpPage } from "../features/auth/components/sign-up-page";
import { ProtectedRoutes } from "./protected-routes";
import { PublicRoutes } from "./public-routes";
import { AppLayout } from "../components/app-layout";

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicRoutes />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Route>

    <Route element={<ProtectedRoutes />}>
      <Route element={<AppLayout />}>
        {/* provisório: vira a ConnectionsPage na etapa 6 */}
        <Route
          path="/connections"
          element={<Typography>Conexões</Typography>}
        />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/connections" replace />} />
  </Routes>
);
