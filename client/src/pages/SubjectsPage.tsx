import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AlertMessage from "../components/AlertMessage";

function Subjects() {
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [selectedRowEdit, setSelectedRowEdit] = useState<Student | null>(null);
  const [selectedRowDel, setSelectedRowDel] = useState<Student | null>(null);
  const [selectedRowActive, setSelectedRowActive] = useState<Student | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  //career fetch
  const [selectedCareer, setSelectedCareer] = useState<number | "">("");
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | "">("");
  const [careerDictionary, setCareerDictionary] = useState<{
    [key: number]: string;
  }>({});
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    // Fetch subjects
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch careers
    const fetchCareers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/careers");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        setCareers(data);

        // Create a dictionary mapping CAREER_ID to CAREER_NAME
        const careerDict: { [key: number]: string } = {};
        data.forEach((career: Career) => {
          careerDict[career.CAREER_ID] = career.CAREER_NAME;
        });

        setCareerDictionary(careerDict); // Set the dictionary
      } catch (error) {
        console.error("Error fetching careers: ", error);
      }
    };

    fetchSubjects();
    fetchCareers();
  }, []);

  //periodos
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

  const formDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "SUBJECT_NAME",
      headerName: "NOMBRE",
      width: 200,
    },
    {
      field: "CAREER_ID",
      headerName: "CARRERA ASOCIADA",
      width: 400,
      renderCell: (params) => careerDictionary[params.value] || "Unknown", // Map CAREER_ID to CAREER_NAME
    },
    {
      field: "SUBJECT_PERIOD",
      headerName: "PERIODO",
      width: 80,
    },
    {
      field: "SUBJECT_CREATION",
      headerName: "CREADO",
      width: 130,
    },
    {
      field: "SUBJECT_LAST_UPDATE",
      headerName: "EDITADO",
      width: 130,
    },
    {
      field: "SUBJECT_STATUS",
      headerName: "ESTADO",
      width: 100,
      renderCell: (params) => (params.value ? "Activo" : "Inactivo"),
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
            disabled={params.row.SUBJECT_STATUS === 0}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.row)}
            disabled={params.row.SUBJECT_STATUS === 0}
          >
            <DeleteIcon></DeleteIcon>
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleActivateRow(params.row, 1)}
            disabled={params.row.SUBJECT_STATUS === 1}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </>
      ),
    },
  ];

  const rows = subjects.map((subject) => ({
    id: subject.SUBJECT_ID,
    SUBJECT_NAME: subject.SUBJECT_NAME,
    CAREER_ID: subject.CAREER_ID,
    SUBJECT_PERIOD: subject.SUBJECT_PERIOD,
    SUBJECT_CREATION: formDate(subject.SUBJECT_CREATION),
    SUBJECT_LAST_UPDATE: formDate(subject.SUBJECT_LAST_UPDATE),
    SUBJECT_STATUS: subject.SUBJECT_STATUS,
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  //edit
  const handleEditRow = (row: subject) => {
    setSelectedRowEdit(row);
    setSelectedCareer(row.CAREER_ID); // Set the selected career
    setSelectedPeriod(row.SUBJECT_PERIOD); // Set the selected period
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: Row) => {
    //console.log(updatedRow.id);
    try {
      // Crear un nuevo objeto con la estructura requerida
      const dataToSend = {
        SUBJECT_ID: updatedRow.id, // ID de la materia
        SUBJECT_NAME: updatedRow.SUBJECT_NAME, // Nombre de la materia
        CAREER_ID: selectedCareer, // Carrera seleccionada
        SUBJECT_PERIOD: selectedPeriod, // Periodo seleccionado
      };

      const url = `http://localhost:8000/api/subjects/${dataToSend.SUBJECT_ID}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Enviar los datos actualizados
      });

      if (!response.ok) {
        throw new Error(`Failed to update subject: ${response.statusText}`);
      }

      const data = await response.json();
      // datos de la alertra
      setAlertMessage("Materia actualizada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Actualiza la página después de 1 segundo
    } catch (error) {
      console.error("Error updating subject:", error);
      setAlertMessage("Error al eliminar la materia");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false); // Cerrar el diálogo de edición
      setSelectedRowEdit(null); // Restablecer el estado de la fila seleccionada
    }
  };

  //delete
  const handleDeleteRow = (row: career) => {
    setSelectedRowDel(row);
    setOpenDelDialog(true);
  };

  const handleDeleteSubmit = async (deletedRow: Row) => {
    //console.log(deletedRow.id);
    try {
      const dataToSend = {
        SUBJECT_ID: deletedRow.id,
        SUBJECT_STATUS: 0,
      };
      const url = `http://localhost:8000/api/subjects/${dataToSend.SUBJECT_ID}`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });
      if (!response.ok) {
        throw new Error(`Failed to delete subjects: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Materia eliminada correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
      // Handle successful update, e.g., refresh the list or update local state
    } catch (error) {
      console.error("Error deleting subject:", error);
      setAlertMessage("Error al eliminar la materia");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenDelDialog(false); //close dialog
      setSelectedRowDel(null); //return row value to null
    }
  };

  //activate
  const handleActivateRow = (row: career) => {
    setSelectedRowActive(row);
    setOpenActivateDialog(true);
  };

  const handleActivateSubmit = async (activatedRow: Row) => {
    //console.log(activatedRow.id);
    try {
      const dataToSend = {
        SUBJECT_ID: activatedRow.id,
        SUBJECT_STATUS: 1,
      };
      const url = `http://localhost:8000/api/subjects/${dataToSend.SUBJECT_ID}`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });
      if (!response.ok) {
        throw new Error(`Failed to activate subject: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Materia reactivada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
      // Handle successful update, e.g., refresh the list or update local state
    } catch (error) {
      console.error("Error activating subject:", error);
      setAlertMessage("Error al eliminar la materia");
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

  return (
    <>
      <NavBar></NavBar>
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2 rem" }}>
          <Typography variant="h6">MATERIAS</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.SUBJECT_STATUS === 0 ? "inactive-row" : ""
            }
            sx={{
              border: 0,
              "& .inactive-row": {
                backgroundColor: "#f0f0f0", // Color más oscuro para inactivos
                color: "#999", // Color del texto
              },
            }}
          ></DataGrid>
        </Paper>
        <AlertMessage
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Materia</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.SUBJECT_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      SUBJECT_NAME: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />

                <FormControl sx={{ mt: 4 }} fullWidth>
                  <InputLabel id="career-label">CARRERA</InputLabel>
                  <Select
                    labelId="career-label"
                    label="CARRERA"
                    value={selectedCareer} // Valor de la carrera seleccionada
                    onChange={handleCareerChange} // Función que cambia el valor de selectedCareer
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
                    label="PERIODO"
                    value={selectedPeriod} // Use the selectedPeriod state
                    onChange={handlePeriodChange}
                  >
                    {periods.map((period) => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.value}
                      </MenuItem>
                    ))}
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
        <Dialog open={openDelDialog} onClose={() => setOpenDelDialog(false)}>
          <DialogTitle>Eliminar Materia</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea eliminar esta materia?
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
          <DialogTitle>Reactivar Materia</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea reactivar esta materia?
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

export default Subjects;
