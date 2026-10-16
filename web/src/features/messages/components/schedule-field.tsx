import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import type { SendMode } from "../schemas";

type Props = {
  mode: SendMode;
  onModeChange: (mode: SendMode) => void;
  scheduledAt: Date | null;
  onScheduledAtChange: (date: Date | null) => void;
  error?: string;
};

const toDateOrNull = (value: Dayjs | null) =>
  value?.isValid() ? value.toDate() : null;

export const ScheduleField = ({
  mode,
  onModeChange,
  scheduledAt,
  onScheduledAtChange,
  error,
}: Props) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
    <ToggleButtonGroup
      value={mode}
      exclusive
      size="small"
      aria-label="Quando enviar"
      onChange={(_, next: SendMode | null) => {
        if (next) onModeChange(next);
      }}
    >
      <ToggleButton value="now">Enviar agora</ToggleButton>
      <ToggleButton value="schedule">Agendar</ToggleButton>
    </ToggleButtonGroup>

    {mode === "schedule" && (
      <DateTimePicker
        label="Data e hora"
        value={scheduledAt ? dayjs(scheduledAt) : null}
        onChange={(value) => onScheduledAtChange(toDateOrNull(value))}
        disablePast
        ampm={false}
        format="DD/MM/YYYY HH:mm"
        slotProps={{
          textField: {
            size: "small",
            error: Boolean(error),
            helperText: error,
          },
        }}
      />
    )}
  </div>
);
