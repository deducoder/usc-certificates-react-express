import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
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
      paper: "#EFEFEF",
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

export default Theme;
