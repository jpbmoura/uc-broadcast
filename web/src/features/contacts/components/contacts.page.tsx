import { Typography } from "@mui/material";
import { useConnectionContext } from "../../connections/hooks";

export const ContactsPage = () => {
  const connection = useConnectionContext();
  return (
    <Typography color="text.secondary">
      Contatos de {connection.name}.
    </Typography>
  );
};
