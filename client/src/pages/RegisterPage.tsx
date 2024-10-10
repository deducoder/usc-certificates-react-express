//importing components
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
//importing component
import NavBar from "../components/NavBar";
import CardItem from "../components/CardItem";

//cards items for mapping
const cards: items[] = [
  {
    image:
      "https://plus.unsplash.com/premium_vector-1723628218533-ea8e1f888e25?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "students group",
    title: "ALUMNO",
    caption: "Da de alta un alumno",
    path: "/alumno",
  },
  {
    image:
      "https://plus.unsplash.com/premium_vector-1723628218419-3b9a74fbf88d?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "students group",
    title: "ADMINISTRATIVO",
    caption: "Da de alta un administrativo",
    path: "/administrativo",
  },
  {
    image:
      "https://plus.unsplash.com/premium_vector-1723628218425-ec5c4ad370c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "students group",
    title: "CARRERAS Y  MATERIAS",
    caption: "Da de alta una carrera o materia",
    path: "/carrera-materia",
  },
];

function RegisterPage() {
  return (
    <>
      <NavBar></NavBar>
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2 rem" }}>
          <Typography variant="h6">REGISTRAR</Typography>
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

export default RegisterPage;
