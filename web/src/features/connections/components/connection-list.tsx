import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { formatDate } from "../../../lib/dates";
import type { Connection } from "../../../types/connection";

type Props = {
  connections: Connection[];
  onRename: (connection: Connection) => void;
  onDelete: (connection: Connection) => void;
};

export const ConnectionList = ({ connections, onRename, onDelete }: Props) => (
  <Paper variant="outlined">
    <List disablePadding>
      {connections.map((connection, index) => (
        <ListItem
          key={connection.id}
          disablePadding
          divider={index < connections.length - 1}
          className="gap-1 pr-2"
        >
          <ListItemButton
            component={RouterLink}
            to={`/connections/${connection.id}`}
          >
            <ListItemText
              primary={connection.name}
              secondary={`Criada em ${formatDate(connection.createdAt)}`}
            />
          </ListItemButton>
          <Tooltip title="Renomear">
            <IconButton
              aria-label={`Renomear ${connection.name}`}
              onClick={() => onRename(connection)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              aria-label={`Excluir ${connection.name}`}
              onClick={() => onDelete(connection)}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  </Paper>
);
