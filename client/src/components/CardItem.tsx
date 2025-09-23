import { NavLink } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";

//card definition
interface card {
  title: string;
  caption: string;
  image: string;
  alt: string;
  path: string;
}

function CardItem({ title, caption, image, alt, path }: card) {
  return (
    <>
      <Grid2 size={4}>
        <Card
          sx={{
            minHeight: "11rem",
            padding: 2,
            transition: "0.2s",
            "&:hover": {
              transform: "scale(1.05)",
            },
            borderRadius: "1rem",
            boxShadow: 6, // Aumentamos la sombra para mayor profundidad
          }}
        >
          <CardActionArea>
            <CardMedia
              image={image}
              component="img"
              alt={alt}
              height="100"
              sx={{ borderRadius: ".5rem" }}
            ></CardMedia>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "2rem",
              }}
            >
              <Typography variant="h6">{title}</Typography>
              <Typography variant="caption">{caption}</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button LinkComponent={NavLink} variant="contained" to={path}>
              Administrar
            </Button>
          </CardActions>
        </Card>
      </Grid2>
    </>
  );
}

export default CardItem;
