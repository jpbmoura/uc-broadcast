import { Navigate, Route, Routes } from "react-router";
import { PublicRoutes } from "./public-routes";
import { LoginPage } from "../features/auth/components/login-page";
import { SignUpPage } from "../features/auth/components/sign-up-page";
import { ProtectedRoutes } from "./protected-routes";
import { AppLayout } from "../components/app-layout";
import { ConnectionsPage } from "../features/connections/components/connections-page";
import { ContactsPage } from "../features/contacts/components/contacts.page";
import { BroadcastPage } from "../features/messages/components/broadcast-page";
import { ConnectionLayout } from "../features/connections/components/connections-layout";

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicRoutes />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Route>

    <Route element={<ProtectedRoutes />}>
      <Route element={<AppLayout />}>
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/connections/:connectionId" element={<ConnectionLayout />}>
          <Route index element={<Navigate to="contacts" replace />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="broadcast" element={<BroadcastPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/connections" replace />} />
  </Routes>
);
