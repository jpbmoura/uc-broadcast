import SearchIcon from "@mui/icons-material/Search";
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { formatPhone } from "../../../lib/phone";
import type { Contact } from "../../../types/contact";
import { matchesSearch } from "../../contacts/search";

type Props = {
  contacts: Contact[];
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string;
};

export const RecipientPicker = ({
  contacts,
  value,
  onChange,
  error,
}: Props) => {
  const [search, setSearch] = useState("");
  const selected = useMemo(() => new Set(value), [value]);
  const visible = useMemo(
    () => contacts.filter((contact) => matchesSearch(contact, search)),
    [contacts, search],
  );

  const visibleIds = visible.map((contact) => contact.id);
  const selectedVisible = visibleIds.filter((id) => selected.has(id)).length;
  const allVisibleSelected =
    visible.length > 0 && selectedVisible === visible.length;
  const selectedCount = contacts.filter((contact) =>
    selected.has(contact.id),
  ).length;

  const toggle = (id: string) =>
    onChange(
      selected.has(id) ? value.filter((item) => item !== id) : [...value, id],
    );

  const toggleAll = () =>
    onChange(
      allVisibleSelected
        ? value.filter((id) => !visibleIds.includes(id))
        : [...new Set([...value, ...visibleIds])],
    );

  return (
    <div>
      <Paper
        variant="outlined"
        className={error ? "border-red-600" : undefined}
      >
        <div className="flex flex-col gap-2 border-b border-slate-200 p-3 sm:flex-row sm:items-center">
          <FormControlLabel
            className="m-0 sm:flex-1"
            label={`Todos (${selectedCount} de ${contacts.length})`}
            control={
              <Checkbox
                checked={allVisibleSelected}
                indeterminate={selectedVisible > 0 && !allVisibleSelected}
                onChange={toggleAll}
                disabled={visible.length === 0}
              />
            }
          />
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { "aria-label": "Buscar destinatários" },
            }}
          />
        </div>

        {visible.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            className="p-4 text-center"
          >
            Nenhum contato encontrado.
          </Typography>
        ) : (
          <List dense disablePadding className="max-h-72 overflow-y-auto">
            {visible.map((contact) => {
              const labelId = `recipient-${contact.id}`;
              return (
                <ListItemButton
                  key={contact.id}
                  onClick={() => toggle(contact.id)}
                  dense
                >
                  <ListItemIcon className="min-w-0">
                    <Checkbox
                      edge="start"
                      checked={selected.has(contact.id)}
                      tabIndex={-1}
                      disableRipple
                      slotProps={{ input: { "aria-labelledby": labelId } }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={contact.name}
                    secondary={formatPhone(contact.phone)}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Paper>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
};
