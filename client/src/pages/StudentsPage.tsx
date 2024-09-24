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
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

function Students() {
  const [students, setStudents] = useState<student[]>([]);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  //fetching students list from server
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/students");
        const data = await response.json();
        console.log(data);
        setStudents(data);
      } catch (error) {
        console.error("error fetching students: ", error);
      }
    };
    fetchStudents();
  }, []);
  //students table
  //function to correct format dates
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
      field: "ACTIONS",
      headerName: "ACCIONES",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEditRow(params.row)}>
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteRow(params.row)}>
            <DeleteIcon></DeleteIcon>
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
  const handleEditRow = (row: student) => {
    setSelectedRow(row);
    setOpenEditDialog(true);
    console.log("Edit row:", selectedRow);
  };

  const handleEditSubmit = async (updatedRow: Row) => {
    console.log(updatedRow.id);
    try {
      // Create a new object with the required structure
      const dataToSend = {
        STUDENT_ID: updatedRow.id, // Renaming 'id' to 'STUDENT_ID'
        STUDENT_NAME: updatedRow.STUDENT_NAME,
        STUDENT_PA_LAST_NAME: updatedRow.STUDENT_PA_LAST_NAME,
        STUDENT_MA_LAST_NAME: updatedRow.STUDENT_MA_LAST_NAME,
      };
      const url = `http://localhost:8000/api/students/${dataToSend.STUDENT_ID}`;
      console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });

      if (!response.ok) {
        throw new Error(`Failed to update student: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Update response:", data);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
      // Handle successful update, e.g., refresh the list or update local state
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setOpenEditDialog(false); //close dialog
      setSelectedRow(null); //return row value to null
    }
  };

  //delete
  const handleDeleteRow = (row: student) => {
    setSelectedRow(row);
    console.log("Delete row:", selectedRow);
  };

  useEffect(() => {
    if (selectedRow) {
      console.log("Selected row deleted:", selectedRow);
    } else {
      console.log("Selected row is null.");
    }
  }, [selectedRow]);

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
            sx={{ border: 0 }}
          />
        </Paper>
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogContent>
            {selectedRow && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRow.STUDENT_NAME}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      STUDENT_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Paterno"
                  fullWidth
                  variant="outlined"
                  value={selectedRow.STUDENT_PA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      STUDENT_PA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Materno"
                  fullWidth
                  variant="outlined"
                  value={selectedRow.STUDENT_MA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      STUDENT_MA_LAST_NAME: e.target.value,
                    })
                  }
                />
                {/* 
                <TextField
                  margin="dense"
                  label="Matrícula"
                  fullWidth
                  variant="outlined"
                  value={selectedRow.STUDENT_TUITION}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      STUDENT_TUITION: Number(e.target.value),
                    })
                  }
                />
                */}
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
              onClick={() => selectedRow && handleEditSubmit(selectedRow)}
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
}

export default Students;
