import AddIcon from "@mui/icons-material/Add";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import { Button } from "@mui/material";
import { useState } from "react";
import { ConfirmDialog } from "../../../components/confirm-dialog";
import { EmptyState, ListState } from "../../../components/list-state";
import { PageHeader } from "../../../components/page-header";
import { useNotify } from "../../../components/feedback/notify-context";
import type { Connection } from "../../../types/connection";
import { useCurrentUser } from "../../auth/hooks";
import { removeConnection } from "../api";
import { useConnections } from "../hooks";
import { ConnectionFormDialog } from "./connection-form-dialog";
import { ConnectionList } from "./connection-list";

export const ConnectionsPage = () => {
  const { uid } = useCurrentUser();
  const notify = useNotify();
  const { data: connections, loading, error } = useConnections(uid);

  const [formTarget, setFormTarget] = useState<Connection | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Connection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await removeConnection(toDelete.id);
      notify("Conexão excluída");
      setToDelete(null);
    } catch (error) {
      console.error("[ConnectionsPage]", error);
      notify("Não foi possível excluir a conexão", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => setFormTarget("new");

  return (
    <>
      <PageHeader
        title="Conexões"
        subtitle="Cada conexão tem seus próprios contatos e mensagens"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Nova conexão
          </Button>
        }
      />

      <ListState
        loading={loading}
        error={error}
        isEmpty={connections.length === 0}
        empty={
          <EmptyState
            icon={<HubOutlinedIcon fontSize="large" />}
            title="Nenhuma conexão ainda"
            description="Crie uma conexão para cadastrar contatos e enviar mensagens."
            action={
              <Button variant="outlined" onClick={openCreate}>
                Criar primeira conexão
              </Button>
            }
          />
        }
      >
        <ConnectionList
          connections={connections}
          onRename={setFormTarget}
          onDelete={setToDelete}
        />
      </ListState>

      {formTarget && (
        <ConnectionFormDialog
          connection={formTarget === "new" ? null : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir conexão?"
        description={`"${toDelete?.name}" e todos os seus contatos e mensagens serão apagados. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};
