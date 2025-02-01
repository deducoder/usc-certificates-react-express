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
import AlertMessage from "../components/AlertMessage";

interface Career {
  CAREER_NAME: string;
}

interface Subject {
  CAREER_ID: number;
  SUBJECT_NAME: string;
  SUBJECT_PERIOD: number;
}

const RegCareerSubjectPage: React.FC = () => {
  const [careerName, setCarrerName] = useState<string>("");
  //subjects consts
  const [selectedCareer, setSelectedCareer] = useState<number | "">("");
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | "">("");
  const [subjectName, setSubjectName] = useState<string>("");
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSubmitCareer = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    const careerData: Career = {
      CAREER_NAME: careerName,
    };
    try {
      const careerResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerData),
      });
      if (!careerResponse.ok) throw new Error("Failed to register career");
      // datos de la alertra
      setAlertMessage("Carrera creada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      // datos de la alertra
      setAlertMessage("Error al crear la carrera correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`);
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
    //console.log("Selected Career ID:", careerId);
  };

  const handlePeriodChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const periodNum = e.target.value as number;
    setSelectedPeriod(periodNum);
    //console.log("Selected Period:", periodNum);
  };

  const periods: item[] = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 4,
    },
    {
      value: 5,
    },
    {
      value: 6,
    },
    {
      value: 7,
    },
    {
      value: 8,
    },
  ];

  const handleSubmitSubject = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    const subjectData: Subject = {
      CAREER_ID: selectedCareer,
      SUBJECT_NAME: subjectName,
      SUBJECT_PERIOD: selectedPeriod,
    };
    //console.log(subjectData);
    try {
      const subjectResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subjectData), // Asegúrate de que `subjectData` contiene los datos correctos.
        }
      );      
      if (!subjectResponse.ok) throw new Error("Failed to register subject");
      // datos de la alertra
      setAlertMessage("Materia creada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      // datos de la alertra
      setAlertMessage("Error al crear la materia");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  //cerrar alerta
  const handleAlertClose = () => setAlertOpen(false);

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
              <form onSubmit={handleSubmitSubject}>
                <Typography variant="h6">DATOS DE LA MATERIA</Typography>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="NOMBRE DE LA MATERIA"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <InputLabel id="career-label">CARRERA</InputLabel>
                  <Select
                    labelId="career-label"
                    label="CARRERA"
                    value={selectedCareer}
                    onChange={handleCareerChange}
                  >
                    {careers.map((career) => (
                      <MenuItem key={career.CAREER_ID} value={career.CAREER_ID}>
                        {career.CAREER_NAME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <InputLabel id="period-label">PERIODO</InputLabel>
                  <Select
                    labelId="period-label"
                    label="CARRERA"
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                  >
                    {periods.map((period) => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
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
        <AlertMessage
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
      </Container>
    </>
  );
};

export default RegCareerSubjectPage;
