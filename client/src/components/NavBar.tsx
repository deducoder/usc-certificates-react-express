import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";

const pages = ["REGISTRAR", "ADMINISTRAR"]; //navbar pages buttons

function NavBar() {
  return (
    <>
      <AppBar position="static" sx={{ borderRadius: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
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
