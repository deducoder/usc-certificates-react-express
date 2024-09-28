import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Theme from "./components/Theme.tsx";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      {/* CssBaseline normalizes the default styles */}
      <CssBaseline />

      {/* Box to apply background color to the whole page */}
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default, // Use background color from theme
          minHeight: "100vh", // Ensures full-page height background
        }}
      >
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
