import { createContext } from "react";
import { createTheme } from "@mui/material/styles";

// Paleta para el modo claro con mayor contraste en las tarjetas
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2b7d34",
    },
    secondary: {
      main: "#F6BC00",
    },
    background: {
      default: "#DDDDDD",
      paper: "#ffffff", // Cambiado a blanco para que resalte
    },
    error: {
      main: "#e1432e",
    },
    info: {
      main: "#4C86F9",
    },
    success: {
      main: "#49A84C",
    },
    text: {
      primary: "#202124",
      secondary: "#202124",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Paleta para el modo oscuro con mayor contraste en las tarjetas
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#66bb6a",
    },
    secondary: {
      main: "#ffca28",
    },
    background: {
      default: "#252525ff",
      paper: "#2a2a2a", // Ligeramente más claro para mayor contraste
    },
    error: {
      main: "#f44336",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#b3b3b3",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Contexto para el cambio de modo
export const ColorModeContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
});
