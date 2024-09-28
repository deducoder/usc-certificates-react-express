import {
  Container,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import NavBar from "../components/NavBar";
import AlertMessage from "../components/AlertMessage";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";

//interfaces
interface Student {
  STUDENT_NAME: String;
  STUDENT_PA_LAST_NAME: String;
  STUDENT_MA_LAST_NAME: String;
  STUDENT_TUITION: Number;
}

interface Career {
  CAREER_NAME: String;
}

interface StudentCareer {
  STUDENT_ID: Number;
  CAREER_ID: Number;
  START_DATE: Date;
  END_DATE: Date;
}

interface People {
  PEOPLE_ID: Number;
  PEOPLE_PREFIX: String;
  PEOPLE_NAME: String;
  PEOPLE_CHARGE: String;
  PEOPLE_GENDER: Boolean;
}

const CertificatePage: React.FC = () => {
  const { studentId } = useParams(); //student ID
  const [student, setStudent] = useState<Student | null>(null); //student values
  const [career, setCareer] = useState<Career | null>(null); //career values
  const [studentCareer, setStudentCareer] = useState<StudentCareer | null>(
    null
  ); //student career relation values
  const [people, setPeople] = useState<career[]>([]); //people values
  //edit
  const [selectedRowEdit, setSelectedRowEdit] = useState<Student | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  // alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  //fetching student information
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentResponse = await fetch(
          `http://localhost:8000/api/students/${studentId}`
        );
        const studentData = await studentResponse.json();
        //console.log(studentData);
        setStudent(studentData);
      } catch (error) {
        console.error(error);
      }
    };

    //fetching student-career information
    const fetchStudentCareer = async () => {
      try {
        const studentCareerResponse = await fetch(
          `http://localhost:8000/api/students-careers/${studentId}`
        );
        const studentCareerData = await studentCareerResponse.json();
        //console.log(studentCareerData);
        setStudentCareer(studentCareerData);
        if (studentCareerData.CAREER_ID) {
          fetchCareer(studentCareerData.CAREER_ID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    //fetching career information
    const fetchCareer = async (careerId: number) => {
      try {
        const careerResponse = await fetch(
          `http://localhost:8000/api/careers/${careerId}`
        );
        const careerData = await careerResponse.json();
        //console.log(careerData);
        setCareer(careerData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
    fetchStudentCareer();
  }, [studentId]);

  //fetchingCertificatePeople
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/people");
        const data = await response.json();
        //console.log(data);
        setPeople(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPeople();
  }, []);

  //creating table for people
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "PEOPLE_PREFIX",
      headerName: "PREFIJO",
      width: 100,
    },
    {
      field: "PEOPLE_NAME",
      headerName: "NOMBRE",
      width: 400,
    },
    {
      field: "PEOPLE_CHARGE",
      headerName: "CARGO",
      width: 500,
    },
    {
      field: "PEOPLE_GENDER",
      headerName: "GÉNERO",
      width: 130,
      renderCell: (params) => (params.value ? "Masculino" : "Femenino"),
    },
    {
      field: "ACTIONS",
      headerName: "ACCIONES",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEditRow(params.row)}>
            <EditIcon></EditIcon>
          </IconButton>
        </>
      ),
    },
  ];

  const rows = people.map((person) => ({
    id: person.PEOPLE_ID,
    PEOPLE_PREFIX: person.PEOPLE_PREFIX,
    PEOPLE_NAME: person.PEOPLE_NAME,
    PEOPLE_CHARGE: person.PEOPLE_CHARGE,
    PEOPLE_GENDER: person.PEOPLE_GENDER,
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  //edit
  const handleEditRow = (row: person) => {
    //console.log(row);
    setSelectedRowEdit(row);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: Row) => {
    try {
      const dataToSend = {
        PEOPLE_ID: updatedRow.id,
        PEOPLE_NAME: updatedRow.PEOPLE_NAME,
        PEOPLE_CHARGE: updatedRow.PEOPLE_CHARGE,
        PEOPLE_GENDER: updatedRow.PEOPLE_GENDER,
      };
      const url = `http://localhost:8000/api/people/${dataToSend.PEOPLE_ID}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Failed to update person: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("Update response:", data);
      // datos de la alertra
      setAlertMessage("Responsable actualizado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
      // Handle successful update, e.g., refresh the list or update local state
    } catch (error) {
      console.error("Error updating student:", error);
      setAlertMessage("Error al actualizar el responsable");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false); //close dialog
      setSelectedRowEdit(null); //return row value to null
    }
  };

  const handleAlertClose = () => setAlertOpen(false);

  useEffect(() => {
    if (selectedRowEdit) {
      //console.log("Selected row edited:", selectedRowEdit);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowEdit]);

  return (
    <>
      <NavBar />
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6">
            {`${student?.STUDENT_NAME || "Unknown"} ${
              student?.STUDENT_PA_LAST_NAME || ""
            } ${student?.STUDENT_MA_LAST_NAME || ""}`}
          </Typography>
          <Typography variant="body1">
            {`CARRERA: ${career?.CAREER_NAME ?? "N/A"}`}
          </Typography>
          <Typography variant="body1">
            {`PERIODO INICIO: ${studentCareer?.START_DATE} - FIN:  ${studentCareer?.END_DATE}`}
          </Typography>
          <Typography variant="body1">
            {`MATRÍCULA: ${student?.STUDENT_TUITION ?? "N/A"}`}
          </Typography>
        </Paper>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6">RESPONSABLES</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
          ></DataGrid>
          <Button variant="contained" sx={{ mt: 2 }}>
            GENERAR
          </Button>
        </Paper>
        <AlertMessage
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Responsable</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Prefijo"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.PEOPLE_PREFIX}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      PEOPLE_PREFIX: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.PEOPLE_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      PEOPLE_NAME: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />
                <TextField
                  margin="dense"
                  label="Cargo"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.PEOPLE_CHARGE}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      PEOPLE_CHARGE: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />
                <FormControl sx={{ mt: 1 }}>
                  <InputLabel id="gender">Género</InputLabel>
                  <Select
                    labelId="gender"
                    margin="dense"
                    label="Género"
                    fullWidth
                    variant="outlined"
                    value={selectedRowEdit.PEOPLE_GENDER}
                    onChange={(e) =>
                      setSelectedRowEdit({
                        ...selectedRowEdit,
                        PEOPLE_GENDER: e.target.value,
                      })
                    }
                    sx={{ minWidth: "30rem" }}
                  >
                    <MenuItem value={0}>Femenino</MenuItem>
                    <MenuItem value={1}>Masculino</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEditDialog(false)}
              variant="contained"
              color="error"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowEdit && handleEditSubmit(selectedRowEdit)
              }
              variant="contained"
              color="primary"
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default CertificatePage;
