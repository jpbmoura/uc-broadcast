import { Tab, Tabs } from "@mui/material";
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router";
import { PageHeader } from "../../../components/page-header";

const TABS = [
  { value: "contacts", label: "Contatos" },
  { value: "broadcast", label: "Broadcast" },
] as const;

const activeTab = (pathname: string) =>
  TABS.find((tab) => pathname.endsWith(`/${tab.value}`))?.value ?? false;

export const ConnectionLayout = () => {
  const { connectionId = "" } = useParams();
  const { pathname } = useLocation();

  return (
    <>
      <PageHeader
        title={`Conexão ${connectionId}`}
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
        <Outlet />
      </section>
    </>
  );
};
