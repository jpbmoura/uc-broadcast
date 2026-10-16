import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { EmptyState, ListState } from "../../../components/list-state";
import { useCurrentUser } from "../../auth/hooks";
import { useConnectionContext } from "../../connections/hooks";
import { useContacts } from "../../contacts/hooks";
import { MessageComposer } from "./message-composer";

export const BroadcastPage = () => {
  const { uid } = useCurrentUser();
  const connection = useConnectionContext();
  const { data: contacts, loading, error } = useContacts(uid, connection.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ListState
        loading={loading}
        error={error}
        isEmpty={contacts.length === 0}
        empty={
          <EmptyState
            icon={<PeopleOutlinedIcon fontSize="large" />}
            title="Nenhum contato nesta conexão"
            description="Cadastre contatos antes de enviar mensagens."
            action={
              <Button
                component={RouterLink}
                to="../contacts"
                variant="outlined"
              >
                Ir para Contatos
              </Button>
            }
          />
        }
      >
        <MessageComposer contacts={contacts} />
      </ListState>

      <section aria-labelledby="messages-title">
        <Typography id="messages-title" variant="subtitle1" component="h2">
          Mensagens
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lista com abas Enviadas e Agendadas.
        </Typography>
      </section>
    </div>
  );
};
