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
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    title: "ALUMNO",
    caption: "Da de alta un alumno",
    path: "alumno",
  },
  {
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    title: "ADMINISTRATIVO",
    caption: "Da de alta un administrativo",
    path: "administrativo",
  },
  {
    image:
      "https://fastly.picsum.photos/id/522/200/300.jpg?hmac=6-KFAVAX70eulRbHj_faT1bRFPGrXhPiDHXe6zPaH-4",
    alt: "students group",
    title: "CARRERAS Y  MATERIAS",
    caption: "Da de alta una carrera o materia",
    path: "carrera-materia",
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
