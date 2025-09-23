import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  IconButton,
  useTheme,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useContext } from "react";

//importing icons
import HomeIcon from "@mui/icons-material/Home";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

//importing statics
import Logo from "../assets/usc-logo-negative.svg";
import { ColorModeContext } from "./Theme";

//types pages definition
interface item {
  title: string;
  path: String;
  icon: JSX.Element;
}

//pages buttons items for mapping
const pages: item[] = [
  //{ title: "INICIO", path: "/", icon: <HomeIcon /> },
  { title: "REGISTRAR", path: "/registrar", icon: <PersonAddAltIcon /> },
  {
    title: "ADMINISTRAR",
    path: "/administrar",
    icon: <AppRegistrationIcon />,
  },
];

function NavBar() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <>
      <AppBar position="sticky" sx={{ borderRadius: 2 }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <img src={Logo} alt="Logo" style={{ width: 50, height: 50 }} />
              </Box>
              <Box sx={{ display: "flex" }}>
                {pages.map((page) => (
                  <Button
                    component={NavLink}
                    to={page.path as string}
                    key={page.title}
                    sx={{
                      m: 1,
                      color: "white",
                      display: "block",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {page.icon}
                      {page.title}
                    </Box>
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Botón para cambiar el modo */}
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBar;
