import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: Props) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle>{title}</DialogTitle>
    {description && (
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color={destructive ? "error" : "primary"}
        disabled={loading}
      >
        {loading ? "Aguarde..." : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
