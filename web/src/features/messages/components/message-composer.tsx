import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import SendIcon from "@mui/icons-material/Send";
import { Button, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTextField } from "../../../components/form-text-field";
import { useNotify } from "../../../components/feedback/notify-context";
import { formatDateTime } from "../../../lib/dates";
import type { Contact } from "../../../types/contact";
import { useCurrentUser } from "../../auth/hooks";
import { useConnectionContext } from "../../connections/hooks";
import { createMessage, toRecipient } from "../api";
import {
  composerSchema,
  emptyComposer,
  type ComposerValues,
  type SendMode,
} from "../schemas";
import { RecipientPicker } from "./recipient-picker";
import { ScheduleField } from "./schedule-field";

const MAX_BODY = 4096;
const nextFullHour = () => dayjs().add(1, "hour").startOf("hour").toDate();
const plural = (count: number, one: string, many: string) =>
  count === 1 ? one : many;

type Props = { contacts: Contact[] };

export const MessageComposer = ({ contacts }: Props) => {
  const { uid } = useCurrentUser();
  const connection = useConnectionContext();
  const notify = useNotify();

  const { control, handleSubmit, reset, setError, formState } =
    useForm<ComposerValues>({
      resolver: zodResolver(composerSchema),
      defaultValues: emptyComposer,
    });
  const { field: recipientsField, fieldState: recipientsState } = useController(
    { control, name: "recipientIds" },
  );
  const { field: modeField } = useController({ control, name: "mode" });
  const { field: dateField, fieldState: dateState } = useController({
    control,
    name: "scheduledAt",
  });
  const body = useWatch({ control, name: "body" });

  const changeMode = (mode: SendMode) => {
    modeField.onChange(mode);
    if (mode === "schedule" && !dateField.value)
      dateField.onChange(nextFullHour());
  };

  const onSubmit = handleSubmit(
    async ({ recipientIds, body, mode, scheduledAt }) => {
      const ids = new Set(recipientIds);
      const recipients = contacts
        .filter((contact) => ids.has(contact.id))
        .map(toRecipient);
      if (recipients.length === 0) {
        setError("recipientIds", {
          message: "Os contatos selecionados não existem mais",
        });
        return;
      }

      const when = mode === "schedule" ? scheduledAt : null;
      try {
        await createMessage(uid, connection.id, {
          body,
          recipients,
          scheduledAt: when,
        });
        const who = `${recipients.length} ${plural(recipients.length, "contato", "contatos")}`;
        notify(
          when
            ? `Mensagem agendada para ${formatDateTime(when)} (${who})`
            : `Enviando para ${who}`,
        );
        reset(emptyComposer);
      } catch (error) {
        console.error("[MessageComposer]", error);
        notify("Não foi possível criar a mensagem", "error");
      }
    },
  );

  const saving = formState.isSubmitting;
  const scheduling = modeField.value === "schedule";

  return (
    <Paper
      variant="outlined"
      component="form"
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 p-4"
    >
      <Typography variant="subtitle1" component="h2">
        Nova mensagem
      </Typography>

      <RecipientPicker
        contacts={contacts}
        value={recipientsField.value}
        onChange={recipientsField.onChange}
        error={recipientsState.error?.message}
      />

      <FormTextField
        name="body"
        control={control}
        label="Mensagem"
        multiline
        minRows={4}
        fullWidth
        helperText={`${body.length}/${MAX_BODY}`}
      />

      <ScheduleField
        mode={modeField.value}
        onModeChange={changeMode}
        scheduledAt={dateField.value}
        onScheduledAtChange={dateField.onChange}
        error={dateState.error?.message}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={scheduling ? <ScheduleSendIcon /> : <SendIcon />}
        >
          {saving ? "Salvando..." : scheduling ? "Agendar" : "Enviar agora"}
        </Button>
      </div>
    </Paper>
  );
};
