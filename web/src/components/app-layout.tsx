import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router";
import { signOut } from "../features/auth/api";
import { useCurrentUser } from "../features/auth/hooks";

const initialOf = (text: string) => text.trim().charAt(0).toUpperCase() || "?";

export const AppLayout = () => {
  const user = useCurrentUser();
  const label = user.displayName ?? user.email ?? "Cliente";

  return (
    <div className="min-h-screen bg-slate-50">
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        className="border-b border-slate-200"
      >
        <Toolbar className="gap-3">
          <Typography
            component={RouterLink}
            to="/connections"
            variant="h6"
            color="inherit"
            className="flex-1 no-underline"
          >
            Broadcast
          </Typography>
          <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
            {initialOf(label)}
          </Avatar>
          <Typography variant="body2" className="hidden sm:block">
            {label}
          </Typography>
          <Button color="inherit" onClick={() => signOut()}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
