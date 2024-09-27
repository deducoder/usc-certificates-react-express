import { NavLink } from "react-router-dom";
import { Paper, Typography, Grid2, Container } from "@mui/material";
//importing components
import NavBar from "../components/NavBar";
import CardItem from "../components/CardItem";

//cards items for mapping
const cards: items[] = [
  {
    title: "ALUMNOS",
    caption: "Consulta, edita o elimina alumnos",
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    path: "alumnos",
  },
  {
    title: "ADMINISTRATIVOS",
    caption: "Consulta, edita o elimina administrativos",
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    path: "administrativos",
  },
  {
    title: "CARRERAS",
    caption: "Consulta, edita o elimina carreras",
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    path: "carreras",
  },
  {
    title: "MATERIAS",
    caption: "Consulta, edita o elimina materias",
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    path: "materias",
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
              <CardItem
                key={card.title}
                title={card.title}
                caption={card.caption}
                image={card.image}
                alt={card.alt}
                path={card.path}
              />
            ))}
          </Grid2>
        </Paper>
      </Container>
    </>
  );
}

export default AdministratePage;
