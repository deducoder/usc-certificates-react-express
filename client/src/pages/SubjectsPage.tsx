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
  Box,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import AlertMessage from "../components/AlertMessage";

// Subject interface
interface Subject {
  SUBJECT_ID: number;
  SUBJECT_NAME: string;
  SUBJECT_PERIOD: string;
  SUBJECT_QUARTER: string;
  SUBJECT_STATUS: number;
  CAREER_ID: number;
  CAREER_NAME?: string; // Optional because it's added after fetching
}

// Career interface
interface Career {
  CAREER_ID: number;
  CAREER_NAME: string;
  CAREER_STATUS: number;
}

// Row type definition for DataGrid
interface Row extends Subject {
  id: number;
}

function Subjects() {
  const [subjects, setSubjects] = useState<Row[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedRowEdit, setSelectedRowEdit] = useState<Row | null>(null);
  const [selectedRowDel, setSelectedRowDel] = useState<Row | null>(null);
  const [selectedRowActive, setSelectedRowActive] = useState<Row | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedCareerFilter, setSelectedCareerFilter] = useState<number | "">(
    ""
  );
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState("");

  // Fetching subjects and careers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/subjects`
        );
        const subjectsData = await subjectsResponse.json();

        const careersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/careers`
        );
        const careersData = await careersResponse.json();
        setCareers(careersData);

        const subjectsWithCareerNames = subjectsData.map((subject: Subject) => {
          const career = careersData.find(
            (c: Career) => c.CAREER_ID === subject.CAREER_ID
          );
          return {
            ...subject,
            id: subject.SUBJECT_ID,
            CAREER_NAME: career ? career.CAREER_NAME : "N/A",
          };
        });

        setSubjects(subjectsWithCareerNames);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  // Columns names
  const columns: GridColDef[] = [
    { field: "SUBJECT_NAME", headerName: "MATERIA", width: 300 },
    { field: "CAREER_NAME", headerName: "CARRERA", width: 200 },
    { field: "SUBJECT_PERIOD", headerName: "PERIODO", width: 130 },
    { field: "SUBJECT_QUARTER", headerName: "CUATRIMESTRE", width: 130 },
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
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.row)}
            disabled={params.row.SUBJECT_STATUS === 0}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleActivateRow(params.row)}
            disabled={params.row.SUBJECT_STATUS === 1}
          >
            <ReplayIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Edit
  const handleEditRow = (row: Row) => {
    setSelectedRowEdit(row);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: Row) => {
    try {
      const dataToSend = {
        ...updatedRow,
        SUBJECT_ID: updatedRow.id,
      };

      const url = `${import.meta.env.VITE_API_URL}/api/subjects/${
        dataToSend.SUBJECT_ID
      }`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Failed to update subject: ${response.statusText}`);
      }

      setAlertMessage("Materia actualizada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error updating subject:", error);
      setAlertMessage("Error al actualizar la materia");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false);
      setSelectedRowEdit(null);
    }
  };

  // Delete
  const handleDeleteRow = (row: Row) => {
    setSelectedRowDel(row);
    setOpenDelDialog(true);
  };

  const handleDeleteSubmit = async (deletedRow: Row) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/subjects/${
        deletedRow.id
      }`;
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`Failed to delete subject: ${response.statusText}`);
      }

      setAlertMessage("Materia eliminada correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error deleting subject:", error);
      setAlertMessage("Error al eliminar la materia");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenDelDialog(false);
      setSelectedRowDel(null);
    }
  };

  // Activate
  const handleActivateRow = (row: Row) => {
    setSelectedRowActive(row);
    setOpenActivateDialog(true);
  };

  const handleActivateSubmit = async (activatedRow: Row) => {
    try {
      const dataToSend = {
        SUBJECT_ID: activatedRow.id,
        SUBJECT_STATUS: 1,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/subjects/${
        dataToSend.SUBJECT_ID
      }`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Failed to activate subject: ${response.statusText}`);
      }

      setAlertMessage("Materia reactivada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error activating subject:", error);
      setAlertMessage("Error al reactivar la materia");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenActivateDialog(false);
      setSelectedRowActive(null);
    }
  };

  const handleAlertClose = () => setAlertOpen(false);

  const filteredSubjects = subjects.filter((subject) => {
    const matchesName = subject.SUBJECT_NAME.toLowerCase().includes(
      searchText.toLowerCase()
    );
    const matchesCareer =
      !selectedCareerFilter || subject.CAREER_ID === selectedCareerFilter;
    const matchesPeriod = String(subject.SUBJECT_PERIOD)
      .toLowerCase()
      .includes(selectedPeriodFilter.toLowerCase());

    return matchesName && matchesCareer && matchesPeriod;
  });

  return (
    <>
      <NavBar />
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6">MATERIAS</Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <TextField
              label="Buscar por Nombre"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FormControl>
              <InputLabel>Filtrar por Carrera</InputLabel>
              <Select
                value={selectedCareerFilter}
                onChange={(e) =>
                  setSelectedCareerFilter(e.target.value as number | "")
                }
                label="Filtrar por Carrera"
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="">
                  <em>Todas las Carreras</em>
                </MenuItem>
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
              label="Filtrar por Periodo"
              variant="outlined"
              value={selectedPeriodFilter}
              onChange={(e) => setSelectedPeriodFilter(e.target.value)}
            />
          </Box>
          <DataGrid
            rows={filteredSubjects}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.SUBJECT_STATUS === 0 ? "inactive-row" : ""
            }
            sx={{
              border: 0,
              "& .inactive-row": {
                backgroundColor: "#f0f0f0",
                color: "#999",
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
        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Materia</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre de la Materia"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.SUBJECT_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      SUBJECT_NAME: e.target.value,
                    })
                  }
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Carrera</InputLabel>
                  <Select
                    value={selectedRowEdit.CAREER_ID}
                    label="Carrera"
                    onChange={(e) =>
                      setSelectedRowEdit({
                        ...selectedRowEdit,
                        CAREER_ID: e.target.value as number,
                      })
                    }
                  >
                    {careers.map((career) => (
                      <MenuItem key={career.CAREER_ID} value={career.CAREER_ID}>
                        {career.CAREER_NAME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="Periodo"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.SUBJECT_PERIOD}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      SUBJECT_PERIOD: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Cuatrimestre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.SUBJECT_QUARTER}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      SUBJECT_QUARTER: e.target.value,
                    })
                  }
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

        {/* Delete Dialog */}
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

        {/* Activate Dialog */}
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
