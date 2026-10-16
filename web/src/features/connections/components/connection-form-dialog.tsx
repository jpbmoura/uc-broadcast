import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNotify } from "../../../components/feedback/notify-context";
import type { Connection } from "../../../types/connection";
import { useCurrentUser } from "../../auth/hooks";
import { createConnection, renameConnection } from "../api";
import { connectionSchema, type ConnectionValues } from "../schemas";
import { useIsMobile } from "../../../hooks/use-is-mobile";
import { FormTextField } from "../../../components/form-text-field";

type Props = {
  connection: Connection | null;
  onClose: () => void;
};

export const ConnectionFormDialog = ({ connection, onClose }: Props) => {
  const { uid } = useCurrentUser();
  const notify = useNotify();
  const fullScreen = useIsMobile();
  const { control, handleSubmit, formState } = useForm<ConnectionValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: { name: connection?.name ?? "" },
  });

  const onSubmit = handleSubmit(async ({ name }) => {
    try {
      if (connection) {
        await renameConnection(connection.id, name);
        notify("Conexão renomeada");
      } else {
        await createConnection(uid, name);
        notify("Conexão criada");
      }
      onClose();
    } catch (error) {
      console.error("[ConnectionFormDialog]", error);
      notify("Não foi possível salvar a conexão", "error");
    }
  });

  const saving = formState.isSubmitting;

  return (
    <Dialog
      open
      onClose={saving ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
    >
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle>
          {connection ? "Renomear conexão" : "Nova conexão"}
        </DialogTitle>
        <DialogContent>
          <FormTextField
            name="name"
            control={control}
            label="Nome"
            placeholder="Ex.: Loja Centro"
            autoFocus
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
