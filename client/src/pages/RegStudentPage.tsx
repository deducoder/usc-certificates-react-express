import {
  Container,
  FormControl,
  InputLabel,
  Paper,
  TextField,
  Grid2,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import AlertMessage from "../components/AlertMessage";

// Define interfaces for the student and career data
interface StudentData {
  STUDENT_NAME: string;
  STUDENT_PA_LAST_NAME: string;
  STUDENT_MA_LAST_NAME: string;
  STUDENT_TUITION: string; // Tuition as a string
}

interface Career {
  CAREER_ID: number;
  CAREER_NAME: string;
}

// Component definition
const RegStudentPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<number | "">("");
  const [tuitionNumber, setTuitionNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [paternalLastName, setPaternalLastName] = useState<string>("");
  const [maternalLastName, setMaternalLastName] = useState<string>("");
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  // Fetch careers from the backend on component mount
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
  }, []);

  // Handle career selection change
  const handleCareerChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const careerId = e.target.value as number;
    setSelectedCareer(careerId);
    //console.log("Selected Career ID:", careerId);
  };

  // Generate the tuition number based on the latest one
  const generateTuitionNumber = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/students/latest");
      if (!response.ok) throw new Error("Network response was not ok");
      const latestTuition: number = await response.json();
      if (latestTuition) {
        const fixedPart = "4132";
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const lastThreeDigits = latestTuition % 1000;
        const incrementedDigits = (lastThreeDigits + 1) % 1000;
        const newLastThreeDigits = incrementedDigits
          .toString()
          .padStart(3, "0");
        const newTuitionNumber = `${fixedPart}${currentYear}${newLastThreeDigits}`;
        setTuitionNumber(newTuitionNumber);
      } else {
        console.error("Can't get the last tuition number");
      }
    } catch (error) {
      console.error("Error fetching latest tuition number: ", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create the student data object
    const studentData: StudentData = {
      STUDENT_NAME: studentName,
      STUDENT_PA_LAST_NAME: paternalLastName,
      STUDENT_MA_LAST_NAME: maternalLastName,
      STUDENT_TUITION: tuitionNumber,
    };

    try {
      // Register the student
      const studentResponse = await fetch(
        "http://localhost:8000/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!studentResponse.ok) throw new Error("Failed to register student");

      // Retrieve the student ID from the response
      const newStudent = await studentResponse.json();
      const studentId = newStudent.STUDENT_ID;

      // Create the student career object
      const studentCareerData = {
        STUDENT_ID: studentId,
        CAREER_ID: selectedCareer,
        START_DATE: startDate,
        END_DATE: endDate,
      };

      // Register the student career
      const careerResponse = await fetch(
        "http://localhost:8000/api/students-careers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentCareerData),
        }
      );

      if (!careerResponse.ok)
        throw new Error("Failed to register student career");
      // datos de la alertra
      setAlertMessage("Alumno creado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      //console.log("Student and career registered successfully!");
    } catch (error) {
      console.error("Error during registration: ", error);
      // datos de la alertra
      setAlertMessage("Error al crear el alumno");
      setAlertSeverity("error");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  //cerrar alerta
  const handleAlertClose = () => setAlertOpen(false);

  return (
    <>
      <NavBar />
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 size={4} key="personal">
                <Typography variant="h6">DATOS PERSONALES</Typography>
                <FormControl sx={{ mt: 4 }} fullWidth>
                  <TextField
                    variant="outlined"
                    label="NOMBRE/S"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
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
              <Grid2 size={4} key="schoolar">
                <Typography variant="h6">DATOS ESCOLARES</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
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
                        <MenuItem
                          key={career.CAREER_ID}
                          value={career.CAREER_ID}
                        >
                          {career.CAREER_NAME}
                        </MenuItem>
                      ))}
                    </Select>

                    <TextField
                      variant="outlined"
                      label="MATRÍCULA"
                      value={tuitionNumber}
                      onChange={(e) => setTuitionNumber(e.target.value)}
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
                      onClick={generateTuitionNumber}
                    >
                      GENERAR
                    </Button>
                  </FormControl>
                </Box>
              </Grid2>
              <Grid2 size={4} key="dates">
                <Typography variant="h6">PERIODO</Typography>
                <TextField
                  variant="outlined"
                  label="FECHA INICIO"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 4, mt: 4 }}
                />
                <TextField
                  variant="outlined"
                  label="FECHA FIN"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid2>
            </Grid2>
          </form>
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

export default RegStudentPage;
