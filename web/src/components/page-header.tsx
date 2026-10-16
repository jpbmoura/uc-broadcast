import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";
import { useDocumentTitle } from "../hooks/use-document-title";

type Props = {
  title: string;
  subtitle?: string;
  back?: { to: string; label: string };
  action?: ReactNode;
};

export const PageHeader = ({ title, subtitle, back, action }: Props) => {
  useDocumentTitle(title);

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Button
            component={RouterLink}
            to={back.to}
            size="small"
            startIcon={<ArrowBackIcon />}
            className="mb-2 -ml-2"
          >
            {back.label}
          </Button>
        )}
        <Typography variant="h5" component="h1" noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};
