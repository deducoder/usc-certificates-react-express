import { useMemo, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, lightTheme, darkTheme } from "./components/Theme";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Seleccionamos el tema basándonos en el estado actual
  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
