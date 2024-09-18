import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";

//importing icons
import HomeIcon from "@mui/icons-material/Home";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

//importing statics
import Logo from "../assets/usc-logo-negative.svg";

//types pages definition
interface item {
  title: string;
  path: String;
  icon: TSX.Element;
}

//pages buttons items for mapping
const pages: item[] = [
  { title: "INICIO", path: "/", icon: <HomeIcon /> },
  { title: "REGISTRAR", path: "/registrar", icon: <PersonAddAltIcon /> },
  {
    title: "ADMINISTRAR",
    path: "/administrar",
    icon: <AppRegistrationIcon />,
  },
];

function NavBar() {
  return (
    <>
      <AppBar position="sticky" sx={{ borderRadius: 2 }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters sx={{ justifyContent: "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <img src={Logo} alt="Logo" style={{ width: 50, height: 50 }} />
            </Box>
            <Box sx={{ display: "flex" }}>
              {pages.map((page) => (
                <Button
                  LinkComponent={NavLink}
                  to={page.path}
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
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBar;
