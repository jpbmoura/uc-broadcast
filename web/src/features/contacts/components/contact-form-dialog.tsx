import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FormTextField } from "../../../components/form-text-field";
import { useNotify } from "../../../components/feedback/notify-context";
import { useIsMobile } from "../../../hooks/use-is-mobile";
import { formatPhone, normalizePhone } from "../../../lib/phone";
import type { Contact } from "../../../types/contact";
import { useCurrentUser } from "../../auth/hooks";
import { useConnectionContext } from "../../connections/hooks";
import { createContact, updateContact } from "../api";
import { contactSchema, type ContactValues } from "../schemas";

type Props = {
  contact: Contact | null;
  contacts: Contact[];
  onClose: () => void;
};

export const ContactFormDialog = ({ contact, contacts, onClose }: Props) => {
  const { uid } = useCurrentUser();
  const connection = useConnectionContext();
  const notify = useNotify();
  const fullScreen = useIsMobile();
  const { control, handleSubmit, setError, formState } = useForm<ContactValues>(
    {
      resolver: zodResolver(contactSchema),
      defaultValues: {
        name: contact?.name ?? "",
        phone: contact ? formatPhone(contact.phone) : "",
      },
    },
  );

  const onSubmit = handleSubmit(async (values) => {
    const phone = normalizePhone(values.phone);
    const duplicate = contacts.find(
      (other) => other.phone === phone && other.id !== contact?.id,
    );
    if (duplicate) {
      setError("phone", {
        message: `Este telefone já é de ${duplicate.name} nesta conexão`,
      });
      return;
    }

    try {
      if (contact) {
        await updateContact(contact.id, values);
        notify("Contato atualizado");
      } else {
        await createContact(uid, connection.id, values);
        notify("Contato adicionado");
      }
      onClose();
    } catch (error) {
      console.error("[ContactFormDialog]", error);
      notify("Não foi possível salvar o contato", "error");
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
        <DialogTitle>{contact ? "Editar contato" : "Novo contato"}</DialogTitle>
        <DialogContent className="flex flex-col gap-2">
          <FormTextField
            name="name"
            control={control}
            label="Nome"
            autoFocus
            fullWidth
            margin="dense"
          />
          <FormTextField
            name="phone"
            control={control}
            label="Telefone"
            placeholder="(15) 99999-9999"
            helperText="DDD + número. Para outro país, comece com +"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
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
