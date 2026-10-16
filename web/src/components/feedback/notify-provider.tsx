import { Alert, Snackbar } from "@mui/material";
import { useCallback, useState, type PropsWithChildren } from "react";
import { NotifyContext, type Notify, type Severity } from "./notify-context";

type Toast = { id: number; message: string; severity: Severity };

export const NotifyProvider = ({ children }: PropsWithChildren) => {
  const [toast, setToast] = useState<Toast>({
    id: 0,
    message: "",
    severity: "success",
  });
  const [open, setOpen] = useState(false);

  const notify = useCallback<Notify>((message, severity = "success") => {
    setToast({ id: Date.now(), message, severity });
    setOpen(true);
  }, []);

  const close = () => setOpen(false);

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        key={toast.id}
        open={open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== "clickaway" && close()}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={close}
          className="w-full"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
};
