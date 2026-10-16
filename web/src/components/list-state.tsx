import { Alert, CircularProgress, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
    {icon && <div className="mb-1 text-slate-400">{icon}</div>}
    <Typography>{title}</Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" className="max-w-sm">
        {description}
      </Typography>
    )}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

type ListStateProps = {
  loading: boolean;
  error?: Error | null;
  isEmpty: boolean;
  empty: ReactNode;
  children: ReactNode;
};

export const ListState = ({
  loading,
  error,
  isEmpty,
  empty,
  children,
}: ListStateProps) => {
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
        Não foi possível carregar os dados. Recarregue a página.
      </Alert>
    );
  }
  return <>{isEmpty ? empty : children}</>;
};
