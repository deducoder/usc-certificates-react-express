import {
  Container,
  Paper,
  Grid2,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";

interface Career {
  CAREER_NAME: string;
}

const RegCareerSubjectPage: React.FC = () => {
  const [careerName, setCarrerName] = useState<string>("");
  //subjects consts
  const [selectedCareer, setSelectedCareer] = useState<number | "">("");
  const [careers, setCareers] = useState<Career[]>([]);

  const handleSubmitCareer = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    const careerData: Career = {
      CAREER_NAME: careerName,
    };
    try {
      const careerResponse = await fetch("http://localhost:8000/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerData),
      });
      if (!careerResponse.ok) throw new Error("Failed to register career");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/careers");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCareers(data);
      } catch (error) {
        console.error("Error fetching careers: ", error);
      }
    };
    fetchCareers();
  });

  const handleCareerChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const careerId = e.target.value as number;
    setSelectedCareer(careerId);
    console.log("Selected Career ID:", careerId);
  };

  return (
    <>
      <NavBar></NavBar>
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Grid2 container spacing={3}>
            <Grid2 size={6} key="career">
              <form onSubmit={handleSubmitCareer}>
                <Typography variant="h6">DATOS DE LA CARRERA</Typography>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="NOMBRE DE LA CARRERA"
                    value={careerName}
                    onChange={(e) => setCarrerName(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <Button
                    variant="contained"
                    sx={{
                      maxWidth: "15rem",
                      mt: 4,
                      mb: 4,
                      minHeight: "3.4rem",
                      minWidth: "10rem",
                    }}
                    type="submit"
                  >
                    CREAR
                  </Button>
                </FormControl>
              </form>
            </Grid2>
            <Grid2 size={6} key="subject">
              <form>
                <Typography variant="h6">DATOS DE LA MATERIA</Typography>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField variant="outlined" label="NOMBRE DE LA MATERIA" />
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <InputLabel id="career-label">CARRERA</InputLabel>
                  <Select
                    labelId="career-label"
                    label="CARRERA"
                    value={selectedCareer}
                    onChange={handleCareerChange}
                    sx={{ mb: 4 }}
                  >
                    {careers.map((career) => (
                      <MenuItem key={career.CAREER_ID} value={career.CAREER_ID}>
                        {career.CAREER_NAME}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    variant="contained"
                    sx={{
                      maxWidth: "15rem",
                      mt: 4,
                      mb: 4,
                      minHeight: "3.4rem",
                      minWidth: "10rem",
                    }}
                    type="submit"
                  >
                    CREAR
                  </Button>
                </FormControl>
              </form>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </>
  );
};

export default RegCareerSubjectPage;
