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
  Grid2,
} from "@mui/material";
import NavBar from "../components/NavBar";
import AlertMessage from "../components/AlertMessage";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
//icons
import EditIcon from "@mui/icons-material/Edit";
//pdf generator
import { certificatePDF } from "../utils/certificatePDF";

//interfaces
interface Student {
  STUDENT_ID: number;
  STUDENT_NAME: string;
  STUDENT_PA_LAST_NAME: string;
  STUDENT_MA_LAST_NAME: string;
  STUDENT_TUITION: number;
}

interface Career {
  CAREER_ID: number;
  CAREER_NAME: string;
}

interface StudentCareer {
  STUDENT_ID: number;
  CAREER_ID: number;
  START_DATE: string;
  END_DATE: string;
}

interface People {
  PEOPLE_ID: number;
  PEOPLE_PREFIX: string;
  PEOPLE_NAME: string;
  PEOPLE_CHARGE: string;
  PEOPLE_GENDER: boolean;
}

interface Field {
  FIELD_ID: number;
  FIELD_NAME: string;
  FIELD_VALUE: string;
}

const CertificatePage: React.FC = () => {
  const { studentId } = useParams(); //student ID
  const [student, setStudent] = useState<Student | null>(null); //student values
  const [career, setCareer] = useState<Career | null>(null); //career values
  const [studentCareer, setStudentCareer] = useState<StudentCareer | null>(
    null
  ); //student career relation values
  const [people, setPeople] = useState<People[]>([]); //people values
  //edit
  const [selectedRowEdit, setSelectedRowEdit] = useState<People | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  // alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  //fields
  const [fields, setFields] = useState<Field[]>([]); //people values
  // Current date
  const [certificateNumber, setCertificateNumber] = useState<string>("");

  //fetching student
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${studentId}`
        );
        const studentData = await studentResponse.json();
        setStudent(studentData);
      } catch (error) {
        console.error(error);
      }
    };

    //fetching student-career
    const fetchStudentCareer = async () => {
      try {
        const studentCareerResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students-careers/${studentId}`
        );
        const studentCareerData = await studentCareerResponse.json();
        setStudentCareer(studentCareerData);
        if (studentCareerData.CAREER_ID) {
          fetchCareer(studentCareerData.CAREER_ID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    //fetching career
    const fetchCareer = async (careerId: number) => {
      try {
        const careerResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/careers/${careerId}`
        );
        const careerData = await careerResponse.json();
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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/people`
        );
        const data = await response.json();
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

  //fetchingCertificateFields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/certificate-fields`
        );
        const data = await response.json();
        setFields(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFields();
  }, []);

  const renderFieldIds = [1, 2, 3, 4, 5, 6, 7, 8];

  const paginationModel = { page: 0, pageSize: 10 };

  //edit fields
  const handleEditField = async (fieldId: number, updatedValue: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/certificate-fields/${fieldId}`,
        {
          method: "PUT", // update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ FIELD_VALUE: updatedValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la actualización del campo");
      }

      await response.json();
      setAlertMessage("Campo actualizado exitosamente");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
      setAlertMessage("Error al actualizar el campo");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  //edit
  const handleEditRow = (row: People) => {
    setSelectedRowEdit(row);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: People) => {
    try {
      const dataToSend = {
        PEOPLE_ID: updatedRow.id,
        PEOPLE_PREFIX: updatedRow.PEOPLE_PREFIX,
        PEOPLE_NAME: updatedRow.PEOPLE_NAME,
        PEOPLE_CHARGE: updatedRow.PEOPLE_CHARGE,
        PEOPLE_GENDER: updatedRow.PEOPLE_GENDER,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/people/${
        dataToSend.PEOPLE_ID
      }`;

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

      await response.json();
      setAlertMessage("Responsable actualizado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating student:", error);
      setAlertMessage("Error al actualizar el responsable");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false);
      setSelectedRowEdit(null);
    }
  };

  const handleAlertClose = () => setAlertOpen(false);

  // Consiguiendo campos de certificate fields para separalos
  const getFieldValueById = (fields: Field[], fieldId: number): string => {
    const field = fields.find((field) => field.FIELD_ID === fieldId);
    return field ? field.FIELD_VALUE : "";
  };

  const handleGenerate = async () => {
    if (!student || !career || !studentCareer) {
      setAlertMessage("Datos del estudiante o carrera no cargados.");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    const dataToSend = {
      // Informacion de la escuela
      REGIMEN: getFieldValueById(fields, 1),
      TURNO: getFieldValueById(fields, 2),
      CLAVE: getFieldValueById(fields, 3),
      MODALIDAD: getFieldValueById(fields, 4),
      RVOE: getFieldValueById(fields, 5),
      VIGENCIA: getFieldValueById(fields, 6),
      SECL: getFieldValueById(fields, 7),
      EXP: getFieldValueById(fields, 8),
      LEGAL_TOP: getFieldValueById(fields, 11), // NUEVO CAMPO
      LEGAL_1: getFieldValueById(fields, 9),
      LEGAL_2: getFieldValueById(fields, 10),
      // Informacion del estudiante
      STUDENT_ID: student.STUDENT_ID,
      STUDENT_NAME: `${student.STUDENT_NAME} ${student.STUDENT_PA_LAST_NAME} ${student.STUDENT_MA_LAST_NAME}`,
      STUDENT_TUITION: student.STUDENT_TUITION,
      STUDENT_CAREER: career.CAREER_NAME,
      CAREER_ID: career.CAREER_ID,
      STUDENT_START_PERIOD: studentCareer.START_DATE,
      STUDENT_END_PERIOD: studentCareer.END_DATE,
      // Información de los responsables
      PEOPLE: {
        1: {
          PEOPLE_ID: people[0]?.PEOPLE_ID ?? 1,
          NAME: `${people[0]?.PEOPLE_PREFIX || ""} ${
            people[0]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[0]?.PEOPLE_CHARGE || "",
        },
        2: {
          PEOPLE_ID: people[1]?.PEOPLE_ID ?? 2,
          NAME: `${people[1]?.PEOPLE_PREFIX || ""} ${
            people[1]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[1]?.PEOPLE_CHARGE || "",
        },
        3: {
          PEOPLE_ID: people[2]?.PEOPLE_ID ?? 3,
          NAME: `${people[2]?.PEOPLE_PREFIX || ""} ${
            people[2]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[2]?.PEOPLE_CHARGE || "",
        },
        4: {
          PEOPLE_ID: people[3]?.PEOPLE_ID ?? 4,
          NAME: `${people[3]?.PEOPLE_PREFIX || ""} ${
            people[3]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[3]?.PEOPLE_CHARGE || "",
        },
        5: {
          PEOPLE_ID: people[4]?.PEOPLE_ID ?? 5,
          NAME: `${people[4]?.PEOPLE_PREFIX || ""} ${
            people[4]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[4]?.PEOPLE_CHARGE || "",
        },
        6: {
          PEOPLE_ID: people[5]?.PEOPLE_ID ?? 6,
          NAME: `${people[5]?.PEOPLE_PREFIX || ""} ${
            people[5]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[5]?.PEOPLE_CHARGE || "",
        },
        7: {
          PEOPLE_ID: people[6]?.PEOPLE_ID ?? 7,
          NAME: `${people[6]?.PEOPLE_PREFIX || ""} ${
            people[6]?.PEOPLE_NAME || ""
          }`,
          CHARGE: people[6]?.PEOPLE_CHARGE || "",
        },
      },
      // Información del certificado
      CERTIFICATE_NUMBER: certificateNumber,
    };
    await certificatePDF(dataToSend);
  };

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
          <Typography variant="h6" sx={{ mb: 2 }}>
            INFORMACIÓN
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={6} key="values">
              {fields
                .filter((field) => renderFieldIds.includes(field.FIELD_ID))
                .map((field) => (
                  <TextField
                    key={field.FIELD_ID}
                    label={field.FIELD_NAME}
                    defaultValue={field.FIELD_VALUE}
                    onBlur={(e) => {
                      handleEditField(field.FIELD_ID, e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                ))}
              <TextField
                label="NÚMERO DE CERTIFICADO"
                fullWidth
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
              ></TextField>
            </Grid2>
            <Grid2 size={6} key="paragraph">
              {/* NUEVO CAMPO LEGAL_TOP */}
              {fields
                .filter((field) => field.FIELD_ID === 11)
                .map((field) => (
                  <TextField
                    key={field.FIELD_ID}
                    label={field.FIELD_NAME}
                    defaultValue={field.FIELD_VALUE}
                    onBlur={(e) => {
                      handleEditField(field.FIELD_ID, e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={8}
                    sx={{ mb: 2 }}
                  />
                ))}
              {/* CAMPOS LEGAL_1 Y LEGAL_2 */}
              {fields
                .filter(
                  (field) => field.FIELD_ID === 9 || field.FIELD_ID === 10
                )
                .map((field) => (
                  <TextField
                    key={field.FIELD_ID}
                    label={field.FIELD_NAME}
                    defaultValue={field.FIELD_VALUE}
                    onBlur={(e) => {
                      handleEditField(field.FIELD_ID, e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                ))}
            </Grid2>
          </Grid2>
        </Paper>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            RESPONSABLES
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
          ></DataGrid>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleGenerate}>
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
                  defaultValue={selectedRowEdit.PEOPLE_PREFIX}
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
                  defaultValue={selectedRowEdit.PEOPLE_NAME}
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
                  defaultValue={selectedRowEdit.PEOPLE_CHARGE}
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
                    value={selectedRowEdit.PEOPLE_GENDER ? 1 : 0}
                    onChange={(e) =>
                      setSelectedRowEdit({
                        ...selectedRowEdit,
                        PEOPLE_GENDER: e.target.value === 1,
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
