import AddIcon from "@mui/icons-material/Add";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../../components/confirm-dialog";
import { EmptyState, ListState } from "../../../components/list-state";
import { useNotify } from "../../../components/feedback/notify-context";
import type { Contact } from "../../../types/contact";
import { useCurrentUser } from "../../auth/hooks";
import { useConnectionContext } from "../../connections/hooks";
import { removeContact } from "../api";
import { useContacts } from "../hooks";
import { matchesSearch } from "../search";
import { ContactFormDialog } from "./contact-form-dialog";
import { ContactList } from "./contact-list";

const countLabel = (count: number) =>
  count === 1 ? "1 contato" : `${count} contatos`;

export const ContactsPage = () => {
  const { uid } = useCurrentUser();
  const connection = useConnectionContext();
  const notify = useNotify();
  const { data: contacts, loading, error } = useContacts(uid, connection.id);

  const [search, setSearch] = useState("");
  const [formTarget, setFormTarget] = useState<Contact | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visible = useMemo(
    () => contacts.filter((contact) => matchesSearch(contact, search)),
    [contacts, search],
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await removeContact(toDelete.id);
      notify("Contato excluído");
      setToDelete(null);
    } catch (error) {
      console.error("[ContactsPage]", error);
      notify("Não foi possível excluir o contato", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => setFormTarget("new");

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou telefone"
          size="small"
          className="sm:max-w-xs"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
            htmlInput: { "aria-label": "Buscar contatos" },
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          className="sm:flex-1"
        >
          {loading ? "" : countLabel(contacts.length)}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Novo contato
        </Button>
      </div>

      <ListState
        loading={loading}
        error={error}
        isEmpty={contacts.length === 0}
        empty={
          <EmptyState
            icon={<PeopleOutlinedIcon fontSize="large" />}
            title="Nenhum contato nesta conexão"
            description="Adicione contatos para poder enviar mensagens a eles."
            action={
              <Button variant="outlined" onClick={openCreate}>
                Adicionar primeiro contato
              </Button>
            }
          />
        }
      >
        {visible.length > 0 ? (
          <ContactList
            contacts={visible}
            onEdit={setFormTarget}
            onDelete={setToDelete}
          />
        ) : (
          <Typography color="text.secondary" className="py-8 text-center">
            Nenhum contato encontrado para “{search}”.
          </Typography>
        )}
      </ListState>

      {formTarget && (
        <ContactFormDialog
          contact={formTarget === "new" ? null : formTarget}
          contacts={contacts}
          onClose={() => setFormTarget(null)}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir contato?"
        description={`"${toDelete?.name}" será removido desta conexão. Mensagens já criadas para ele continuam no histórico.`}
        confirmLabel="Excluir"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};
