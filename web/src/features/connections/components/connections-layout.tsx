import { Alert, Button, CircularProgress, Tab, Tabs } from "@mui/material";
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router";
import { EmptyState } from "../../../components/list-state";
import { PageHeader } from "../../../components/page-header";
import { formatDate } from "../../../lib/dates";
import { useConnection } from "../hooks";

const TABS = [
  { value: "contacts", label: "Contatos" },
  { value: "broadcast", label: "Broadcast" },
] as const;

const activeTab = (pathname: string) =>
  TABS.find((tab) => pathname.endsWith(`/${tab.value}`))?.value ?? false;

export const ConnectionLayout = () => {
  const { connectionId = "" } = useParams();
  const { pathname } = useLocation();
  const { data: connection, loading, error } = useConnection(connectionId);

  if (loading) {
    return (
      <div
        className="flex justify-center py-12"
        role="status"
        aria-label="Carregando"
      >
        <CircularProgress size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Não foi possível carregar a conexão. Recarregue a página.
      </Alert>
    );
  }

  if (!connection) {
    return (
      <EmptyState
        title="Conexão não encontrada"
        description="Ela pode ter sido excluída, ou o link está incorreto."
        action={
          <Button component={RouterLink} to="/connections" variant="outlined">
            Voltar para conexões
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={connection.name}
        subtitle={`Criada em ${formatDate(connection.createdAt)}`}
        back={{ to: "/connections", label: "Conexões" }}
      />

      <Tabs
        value={activeTab(pathname)}
        aria-label="Seções da conexão"
        className="border-b border-slate-200"
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            component={RouterLink}
            to={tab.value}
          />
        ))}
      </Tabs>

      <section className="pt-6">
        <Outlet context={connection} />
      </section>
    </>
  );
};
