import { NavLink } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Paper,
  Typography,
} from "@mui/material";
//importing components
import NavBar from "../components/NavBar";

//cards items for mapping
const cards: items[] = [
  {
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    tittle: "ALUMNOS",
    caption: "Consulta, edita o elimina alumnos",
    path: "/estudiantes",
  },
  {
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    tittle: "ADMINISTRATIVOS",
    caption: "Consulta, edita o elimina administrativoss",
    path: "/estudiantes",
  },
  {
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    tittle: "CARRERAS",
    caption: "Consulta, edita o elimina carreras",
    path: "/estudiantes",
  },
  {
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    tittle: "MATERIAS",
    caption: "Consulta, edita o elimina carreras",
    path: "/estudiantes",
  },
];
function AdministratePage() {
  return (
    <>
      <NavBar></NavBar>
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2 rem" }}>
          <Typography variant="h6">ADMINISTRACIÓN</Typography>
          <Grid2 container spacing={3}>
            {cards.map((card) => (
              <Grid2 size={4} key={card.tittle}>
                <Card
                  sx={{
                    minHeight: "10rem",
                    padding: 2,
                    transition: "0.2s",
                    "&:hover": {
                      transform: "scale(1.08)",
                    },
                    borderRadius: "1rem",
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      image={card.image}
                      component="img"
                      alt={card.alt}
                      height="100"
                      sx={{ borderRadius: ".5rem" }}
                    ></CardMedia>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h6">{card.tittle}</Typography>
                      <Typography variant="caption">{card.caption}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      LinkComponent={NavLink}
                      variant="contained"
                      to={card.path}
                    >
                      Administrar
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Paper>
      </Container>
    </>
  );
}

export default AdministratePage;
