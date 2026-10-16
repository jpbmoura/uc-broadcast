import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import { formatPhone } from "../../../lib/phone";
import type { Contact } from "../../../types/contact";

type Props = {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

export const ContactList = ({ contacts, onEdit, onDelete }: Props) => (
  <Paper variant="outlined">
    <List disablePadding>
      {contacts.map((contact, index) => (
        <ListItem
          key={contact.id}
          divider={index < contacts.length - 1}
          className="gap-1"
        >
          <ListItemText
            primary={contact.name}
            secondary={formatPhone(contact.phone)}
          />
          <Tooltip title="Editar">
            <IconButton
              aria-label={`Editar ${contact.name}`}
              onClick={() => onEdit(contact)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              aria-label={`Excluir ${contact.name}`}
              onClick={() => onDelete(contact)}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  </Paper>
);
