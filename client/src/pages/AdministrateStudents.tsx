//importing components
import { Container, Paper, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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

function AdministrateStudents() {
  const [students, setStudents] = useState<student[]>([]);
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
    { field: "STUDENT_ID", headerName: "ID", width: 70 },
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
      headerName: "ESTATUS",
      width: 130,
      renderCell: (params) => (params.value ? "Activo" : "Inactivo"),
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

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <NavBar></NavBar>
      <Container
        Container
        sx={{ padding: "2rem" }}
        disableGutters
        maxWidth={false}
      >
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
      </Container>
    </>
  );
}

export default AdministrateStudents;
