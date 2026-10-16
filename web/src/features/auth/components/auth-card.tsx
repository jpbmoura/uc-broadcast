import { Paper, Typography } from "@mui/material";

import type { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}>;

export const AuthCard = ({ title, subtitle, footer, children }: Props) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <Paper
      elevation={0}
      className="w-full max-w-md border border-slate-200 p-8"
    >
      <Typography variant="h5" component="h1">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" className="mt-1">
          {subtitle}
        </Typography>
      )}
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
    </Paper>
  </main>
);
