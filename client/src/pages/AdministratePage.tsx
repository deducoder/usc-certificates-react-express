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
      "https://plus.unsplash.com/premium_vector-1723628218533-ea8e1f888e25?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "students group",
    path: "alumnos",
  },
  {
    title: "ADMINISTRATIVOS",
    caption: "Consulta, edita o elimina administrativos",
    image:
      "https://plus.unsplash.com/premium_vector-1723628218419-3b9a74fbf88d?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "students group",
    path: "administrativos",
  },
  {
    title: "CARRERAS",
    caption: "Consulta, edita o elimina carreras",
    image:
      "https://plus.unsplash.com/premium_vector-1723628218422-9e7d27062a5a?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "students group",
    path: "carreras",
  },
  {
    title: "MATERIAS",
    caption: "Consulta, edita o elimina materias",
    image:
      "https://plus.unsplash.com/premium_vector-1723628218421-f0bd43f9a156?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
