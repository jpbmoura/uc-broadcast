import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

export const ConnectionsPage = () => (
  <div className="flex flex-col gap-2">
    <Typography variant="h5" component="h1">
      Conexões
    </Typography>
    <Typography color="text.secondary">
      Lista de conexões.{" "}
      <Link component={RouterLink} to="/connections/demo">
        Abrir uma conexão de exemplo
      </Link>
    </Typography>
  </div>
);
