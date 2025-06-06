//importing components
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import AlertMessage from "../components/AlertMessage";
import PinIcon from "@mui/icons-material/Pin";
import ArticleIcon from "@mui/icons-material/Article";
import { NavLink } from "react-router-dom";

//student definition
interface student {
  STUDENT_ID: number;
  STUDENT_TUITION: number;
  STUDENT_NAME: string;
  STUDENT_PA_LAST_NAME: string;
  STUDENT_MA_LAST_NAME: string;
  STUDENT_CREATION: string;
  STUDENT_LAST_UPDATE: string;
  STUDENT_STATUS: boolean;
}

// Career interface
interface Career {
  CAREER_ID: number;
  CAREER_NAME: string;
  CAREER_STATUS: number;
}

// Row type definition for DataGrid
interface Row extends student {
  id: number;
}

function Students() {
  const [students, setStudents] = useState<Row[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<number>(0);
  const [selectedRowEdit, setSelectedRowEdit] = useState<Row | null>(null);
  const [selectedRowDel, setSelectedRowDel] = useState<Row | null>(null);
  const [selectedRowActive, setSelectedRowActive] = useState<Row | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  //score
  const [selectedStudent, setSelectedStudent] = useState<Row | null>(null);
  // Nuevos estados para las fechas
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  //fetching students and careers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students`
        );
        const studentsData = await studentsResponse.json();
        const studentsWithId = studentsData.map((student: student) => ({
          ...student,
          id: student.STUDENT_ID,
        }));
        setStudents(studentsWithId);

        // Fetch careers
        const careersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/careers`
        );
        const careersData = await careersResponse.json();
        setCareers(careersData);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  //students table
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  //columns names
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "STUDENT_TUITION", headerName: "MATRÍCULA", width: 130 },
    { field: "STUDENT_NAME", headerName: "NOMBRE/S", width: 200 },
    {
      field: "STUDENT_PA_LAST_NAME",
      headerName: "APELLIDO PATERNO",
      width: 200,
    },
    {
      field: "STUDENT_MA_LAST_NAME",
      headerName: "APELLIDO MATERNO",
      width: 200,
    },
    {
      field: "STUDENT_CREATION",
      headerName: "CREADO",
      width: 130,
    },
    {
      field: "STUDENT_LAST_UPDATE",
      headerName: "MODIFICADO",
      width: 130,
    },
    {
      field: "STUDENT_STATUS",
      headerName: "ESTADO",
      width: 100,
      renderCell: (params) => (params.value ? "Activo" : "Inactivo"),
    },
    {
      field: "SCHOOLAR",
      headerName: "ESCOLAR",
      width: 100,
      renderCell: (params) => (
        <>
          <NavLink
            to={`/administrar/alumnos/calificaciones/${params.row.id}`} // Passing the student ID in the URL
            style={{ textDecoration: "none" }}
          >
            <IconButton
              color="warning"
              disabled={params.row.STUDENT_STATUS === 0}
            >
              <PinIcon></PinIcon>
            </IconButton>
          </NavLink>
          <NavLink
            to={`/administrar/alumnos/certificado/${params.row.id}`} // Passing the student ID in the URL
            style={{ textDecoration: "none" }}
          >
            <IconButton
              color="primary"
              disabled={params.row.STUDENT_STATUS === 0}
            >
              <ArticleIcon></ArticleIcon>
            </IconButton>
          </NavLink>
        </>
      ),
    },
    {
      field: "ACTIONS",
      headerName: "ACCIONES",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditRow(params.row)}
            disabled={params.row.STUDENT_STATUS === 0}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.row)}
            disabled={params.row.STUDENT_STATUS === 0}
          >
            <DeleteIcon></DeleteIcon>
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleActivateRow(params.row)}
            disabled={params.row.STUDENT_STATUS === 1}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </>
      ),
    },
  ];

  //rows values from students fetch
  const rows = students.map((student) => ({
    id: student.STUDENT_ID,
    STUDENT_TUITION: student.STUDENT_TUITION,
    STUDENT_NAME: student.STUDENT_NAME,
    STUDENT_PA_LAST_NAME: student.STUDENT_PA_LAST_NAME,
    STUDENT_MA_LAST_NAME: student.STUDENT_MA_LAST_NAME,
    STUDENT_CREATION: formatDate(student.STUDENT_CREATION),
    STUDENT_LAST_UPDATE: formatDate(student.STUDENT_LAST_UPDATE),
    STUDENT_STATUS: student.STUDENT_STATUS,
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  //edit
  const handleEditRow = (row: Row) => {
    setSelectedRowEdit(row);
    // Fetch student career dates and career
    const fetchStudentCareerInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students-careers/${row.id}`
        );
        const data = await response.json();
        console.log("Career info response:", data);
        if (data && data.START_DATE && data.END_DATE) {
          const startDateFormatted = new Date(data.START_DATE)
            .toISOString()
            .split("T")[0];
          const endDateFormatted = new Date(data.END_DATE)
            .toISOString()
            .split("T")[0];
          setStartDate(startDateFormatted);
          setEndDate(endDateFormatted);
          setSelectedCareer(data.CAREER_ID);
        }
      } catch (error) {
        console.error("Error fetching student career info:", error);
        setAlertMessage("Error al obtener la información de la carrera");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    };

    fetchStudentCareerInfo();
    setOpenEditDialog(true);
  };

  const validateDates = () => {
    if (!startDate || !endDate) {
      setAlertMessage("Las fechas son obligatorias");
      setAlertSeverity("error");
      setAlertOpen(true);
      return false;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setAlertMessage("La fecha de inicio debe ser anterior a la fecha de fin");
      setAlertSeverity("error");
      setAlertOpen(true);
      return false;
    }

    return true;
  };

  const handleEditSubmit = async (updatedRow: Row) => {
    if (!validateDates()) {
      return;
    }

    if (!selectedCareer) {
      setAlertMessage("Debe seleccionar una carrera");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    try {
      const dataToSend = {
        STUDENT_ID: updatedRow.id,
        STUDENT_NAME: updatedRow.STUDENT_NAME,
        STUDENT_PA_LAST_NAME: updatedRow.STUDENT_PA_LAST_NAME,
        STUDENT_MA_LAST_NAME: updatedRow.STUDENT_MA_LAST_NAME,
        STUDENT_TUITION: Number(updatedRow.STUDENT_TUITION),
        START_DATE: startDate,
        END_DATE: endDate,
        CAREER_ID: selectedCareer,
      };

      // Update student data
      const studentUrl = `${import.meta.env.VITE_API_URL}/api/students/${
        dataToSend.STUDENT_ID
      }`;
      const studentResponse = await fetch(studentUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          STUDENT_ID: dataToSend.STUDENT_ID,
          STUDENT_NAME: dataToSend.STUDENT_NAME,
          STUDENT_PA_LAST_NAME: dataToSend.STUDENT_PA_LAST_NAME,
          STUDENT_MA_LAST_NAME: dataToSend.STUDENT_MA_LAST_NAME,
          STUDENT_TUITION: dataToSend.STUDENT_TUITION,
        }),
      });

      if (!studentResponse.ok) {
        throw new Error(
          `Failed to update student: ${studentResponse.statusText}`
        );
      }

      // Update student career info
      const careerUrl = `${import.meta.env.VITE_API_URL}/api/students-careers/${
        dataToSend.STUDENT_ID
      }`;
      const careerResponse = await fetch(careerUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          START_DATE: dataToSend.START_DATE,
          END_DATE: dataToSend.END_DATE,
          CAREER_ID: dataToSend.CAREER_ID,
        }),
      });

      if (!careerResponse.ok) {
        throw new Error(
          `Failed to update student career: ${careerResponse.statusText}`
        );
      }

      setAlertMessage("Estudiante y carrera actualizados correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating student and career:", error);
      setAlertMessage("Error al actualizar el estudiante y la carrera");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false);
      setSelectedRowEdit(null);
      setStartDate("");
      setEndDate("");
      setSelectedCareer(0);
    }
  };

  //delete
  const handleDeleteRow = (row: Row) => {
    setSelectedRowDel(row);
    setOpenDelDialog(true);
  };

  const handleDeleteSubmit = async (deletedRow: Row) => {
    //console.log(deletedRow.id);
    try {
      const dataToSend = {
        STUDENT_ID: deletedRow.id,
        STUDENT_STATUS: 0,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/students/${
        dataToSend.STUDENT_ID
      }`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });
      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Estudiante eliminado correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
    } catch (error) {
      console.error("Error deleting student:", error);
      setAlertMessage("Error al eliminar el estudiante");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenDelDialog(false); //close dialog
      setSelectedRowDel(null); //return row value to null
    }
  };

  //activate
  const handleActivateRow = (row: Row) => {
    setSelectedRowActive(row);
    setOpenActivateDialog(true);
  };

  const handleActivateSubmit = async (activatedRow: Row) => {
    //console.log(activatedRow.id);
    try {
      const dataToSend = {
        STUDENT_ID: activatedRow.id,
        STUDENT_STATUS: 1,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/students/${
        dataToSend.STUDENT_ID
      }`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });
      if (!response.ok) {
        throw new Error(`Failed to activate student: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Estudiante reactivado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
    } catch (error) {
      console.error("Error activating student:", error);
      setAlertMessage("Error al reactivar el estudiante");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenActivateDialog(false); //close dialog
      setSelectedRowActive(null); //return row value to null
    }
  };

  useEffect(() => {
    if (selectedRowEdit) {
      //console.log("Selected row edited:", selectedRowEdit);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowEdit]);

  useEffect(() => {
    if (selectedRowDel) {
      //console.log("Selected row deleted:", selectedRowDel);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowDel]);

  useEffect(() => {
    if (selectedRowActive) {
      //console.log("Selected row deleted:", selectedRowDel);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowActive]);

  //cerrar alerta
  const handleAlertClose = () => setAlertOpen(false);

  //scores
  const handleSelectedStudent = (row: Row) => {
    setSelectedStudent(row);
    console.log(row.id);
  };

  // Función para limpiar las fechas y carrera
  const cleanupForm = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCareer(0);
  };

  // Modificar el cierre del diálogo para limpiar el formulario
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    cleanupForm();
  };

  return (
    <>
      <NavBar></NavBar>
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2 rem" }}>
          <Typography variant="h6">ALUMNOS</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.STUDENT_STATUS === 0 ? "inactive-row" : ""
            }
            sx={{
              border: 0,
              "& .inactive-row": {
                backgroundColor: "#f0f0f0", // Color más oscuro para inactivos
                color: "#999", // Color del texto
              },
            }}
          />
        </Paper>
        <AlertMessage
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
        <Dialog open={openEditDialog} onClose={handleCloseDialog}>
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Paterno"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_PA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_PA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Materno"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_MA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_MA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Matrícula"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_TUITION}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_TUITION: Number(e.target.value),
                    })
                  }
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="career-select-label">Carrera</InputLabel>
                  <Select
                    labelId="career-select-label"
                    value={selectedCareer}
                    label="Carrera"
                    onChange={(e) => setSelectedCareer(Number(e.target.value))}
                  >
                    {careers.map((career) => (
                      <MenuItem
                        key={career.CAREER_ID}
                        value={career.CAREER_ID}
                        disabled={career.CAREER_STATUS === 0}
                      >
                        {career.CAREER_NAME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="Fecha de Inicio"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Fecha de Fin"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
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
        <Dialog open={openDelDialog} onClose={() => setOpenDelDialog(false)}>
          <DialogTitle>Eliminar Estudiante</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea eliminar este estudiante?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDelDialog(false)}
              color="primary"
              variant="contained"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowDel && handleDeleteSubmit(selectedRowDel)
              }
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openActivateDialog}
          onClose={() => setOpenActivateDialog(false)}
        >
          <DialogTitle>Reactivar Estudiante</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea reactivar este estudiante?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenActivateDialog(false)}
              color="error"
              variant="contained"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowActive && handleActivateSubmit(selectedRowActive)
              }
              variant="contained"
              color="success"
            >
              Reactivar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default Students;
