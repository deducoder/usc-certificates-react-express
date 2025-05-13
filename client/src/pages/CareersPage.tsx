import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import AlertMessage from "../components/AlertMessage";

function Careers() {
  const [careers, setCareers] = useState<career[]>([]);
  const [selectedRowEdit, setSelectedRowEdit] = useState<Student | null>(null);
  const [selectedRowDel, setSelectedRowDel] = useState<Student | null>(null);
  const [selectedRowActive, setSelectedRowActive] = useState<Student | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`);
        const data = await response.json();
        setCareers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCareers();
  }, []);

  const formatDate = (isoDate: string) => {
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
      field: "CAREER_NAME",
      headerName: "NOMBRE",
      width: 400,
    },
    {
      field: "CAREER_CREATION",
      headerName: "CREADO",
      width: 130,
    },
    {
      field: "CAREER_LAT_UPDATE",
      headerName: "MODIFICADO",
      width: 130,
    },
    {
      field: "CAREER_STATUS",
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
            disabled={params.row.CAREER_STATUS === 0}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.row)}
            disabled={params.row.CAREER_STATUS === 0}
          >
            <DeleteIcon></DeleteIcon>
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleActivateRow(params.row, 1)}
            disabled={params.row.CAREER_STATUS === 1}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </>
      ),
    },
  ];

  const rows = careers.map((career) => ({
    id: career.CAREER_ID,
    CAREER_NAME: career.CAREER_NAME,
    CAREER_CREATION: formatDate(career.CAREER_CREATION),
    CAREER_LAST_UPDATE: formatDate(career.CAREER_LAST_UPDATE),
    CAREER_STATUS: career.CAREER_STATUS,
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  //edit
  const handleEditRow = (row: career) => {
    setSelectedRowEdit(row);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: Row) => {
    //console.log(updatedRow.id);
    try {
      const dataToSend = {
        CAREER_ID: updatedRow.id, // Renaming id to STUDENT_ID
        CAREER_NAME: updatedRow.CAREER_NAME,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/careers/${dataToSend.CAREER_ID}`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), 
      });

      if (!response.ok) {
        throw new Error(`Failed to update career: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("Update response:", data);
      // datos de la alertra
      setAlertMessage("Carrera actualizada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      // tiempo de refresco
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating career:", error);
      setAlertMessage("Error al actualizar la carrera");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false); //close dialog
      setSelectedRowEdit(null); //return row value to null
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
        CAREER_ID: deletedRow.id,
        CAREER_STATUS: 0,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/careers/${dataToSend.CAREER_ID}`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete career: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Carrera eliminada correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting career:", error);
      setAlertMessage("Error al eliminar la carrera");
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
        CAREER_ID: activatedRow.id,
        CAREER_STATUS: 1,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/careers/${dataToSend.CAREER_ID}`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // envia nuevo objeto
      });
      if (!response.ok) {
        throw new Error(`Failed to activate career: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Carrera reactivada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error activating career:", error);
      setAlertMessage("Error al reactivar la carrera");
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
          <Typography variant="h6">CARRERAS</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.CAREER_STATUS === 0 ? "inactive-row" : ""
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
          <DialogTitle>Editar Carrera</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.CAREER_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      CAREER_NAME: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />
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
          <DialogTitle>Eliminar Carrera</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea eliminar esta carrera?
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
          <DialogTitle>Reactivar Carrera</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea reactivar esta carrera?
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

export default Careers;
