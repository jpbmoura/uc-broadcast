import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { theme } from "./theme/theme.ts";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./features/auth/auth-provider.tsx";
import { NotifyProvider } from "./components/feedback/notify-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <BrowserRouter>
            <AuthProvider>
              <NotifyProvider>
                <App />
              </NotifyProvider>
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
