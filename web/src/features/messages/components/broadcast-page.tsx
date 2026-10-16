import { Typography } from "@mui/material";
import { useConnectionContext } from "../../connections/hooks";

export const BroadcastPage = () => {
  const connection = useConnectionContext();

  return (
    <Typography color="text.secondary">
      Composer e lista de mensagens de {connection.name}.
    </Typography>
  );
};
