import {
  Button,
  Container,
  FormControl,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useState } from "react";

function RegAdministrator() {
  const [name, setName] = useState<string>("");
  const [paternalLastName, setPaternalLastName] = useState<string>("");
  const [maternalLastName, setMaternalLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passWord, setPassWord] = useState<string>("");

  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setPassWord(password);
  };

  const registerAdmin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Primero, registrar el usuario
      const userResponse = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          USER_EMAIL: email,
          USER_PASSWORD: passWord,
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.msg || "Error registering user");
      }

      const userData = await userResponse.json();
      console.log(userData.USER_ID);
      const userId = userData.USER_ID; // Obtén el ID del usuario registrado

      // Luego, registrar el administrador
      const adminResponse = await fetch("http://localhost:8000/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ADMIN_NAME: name,
          ADMIN_PA_LAST_NAME: paternalLastName,
          ADMIN_MA_LAST_NAME: maternalLastName,
          USER_ID: userId, // Usa el ID del usuario registrado
        }),
      });

      if (!adminResponse.ok) {
        const errorData = await adminResponse.json();
        throw new Error(errorData.msg || "Error registering admin");
      }

      // Si todo salió bien, puedes hacer algo aquí (por ejemplo, mostrar un mensaje de éxito)
      alert("Administrator registered successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <form onSubmit={registerAdmin}>
            <Grid2 container spacing={3}>
              <Grid2 size={6} key="personal">
                <Typography variant="h6">DATOS PERSONALES</Typography>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="NOMBRE/S"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="APELLIDO PATERNO"
                    value={paternalLastName}
                    onChange={(e) => setPaternalLastName(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="APELLIDO MATERNO"
                    value={maternalLastName}
                    onChange={(e) => setMaternalLastName(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      maxWidth: "15rem",
                      mt: 4,
                      mb: 4,
                      minHeight: "3.4rem",
                    }}
                  >
                    REGISTER
                  </Button>
                </FormControl>
              </Grid2>
              <Grid2 size={6} key="usuario">
                <Typography variant="h6">DATOS DE LA CUENTA</Typography>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="CORREO"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="CONTRASEÑA"
                    value={passWord}
                    onChange={(e) => setPassWord(e.target.value)}
                    InputProps={{
                      sx: {
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      maxWidth: "15rem",
                      mt: 4,
                      mb: 4,
                      minHeight: "3.4rem",
                    }}
                    type="button"
                    onClick={generatePassword}
                  >
                    GENERAR
                  </Button>
                </FormControl>
              </Grid2>
            </Grid2>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default RegAdministrator;
