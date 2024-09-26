import { useEffect, useState } from "react";
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import AlertMessage from "../components/AlertMessage";

function Administrators() {
  const [admins, setAdmins] = useState<admins[]>([]);
  const [users, setUsers] = useState<users[]>([]);
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
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/admins");
        const data = await response.json();
        setAdmins(data);
        //console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users");
        const data = await response.json();
        setUsers(data);
        //console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdmins();
    fetchUsers();
  }, []);

  const formDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "ADMIN_NAME",
      headerName: "NOMBRE",
      width: 150,
    },
    {
      field: "ADMIN_PA_LAST_NAME",
      headerName: "APELLIDO PATERNO",
      width: 160,
    },
    {
      field: "ADMIN_MA_LAST_NAME",
      headerName: "APELLIDO MATERNO",
      width: 160,
    },
    {
      field: "USER_EMAIL",
      headerName: "CORREO",
      width: 200,
    },
    {
      field: "USER_PASSWORD",
      headerName: "CONTRASEÑA",
      width: 150,
    },
    {
      field: "ADMIN_CREATION",
      headerName: "CREADO",
      width: 120,
    },
    {
      field: "ADMIN_LAST_UPDATE",
      headerName: "MODIFICADO",
      width: 120,
    },
    {
      field: "ADMIN_STATUS",
      headerName: "ESTADO",
      width: 80,
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
            disabled={params.row.ADMIN_STATUS === 0}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.row)}
            disabled={params.row.ADMIN_STATUS === 0}
          >
            <DeleteIcon></DeleteIcon>
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleActivateRow(params.row, 1)}
            disabled={params.row.ADMIN_STATUS === 1}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </>
      ),
    },
  ];

  const rows = admins.map((admin) => {
    // Buscar el usuario correspondiente para el administrador
    const relatedUser = users.find((user) => user.USER_ID === admin.ADMIN_ID);

    return {
      id: admin.ADMIN_ID,
      ADMIN_NAME: admin.ADMIN_NAME,
      ADMIN_PA_LAST_NAME: admin.ADMIN_PA_LAST_NAME,
      ADMIN_MA_LAST_NAME: admin.ADMIN_MA_LAST_NAME,
      USER_EMAIL: relatedUser ? relatedUser.USER_EMAIL : "No Email",
      USER_PASSWORD: relatedUser ? relatedUser.USER_PASSWORD : "No Password",
      ADMIN_CREATION: formDate(admin.ADMIN_CREATION),
      ADMIN_LAST_UPDATE: formDate(admin.ADMIN_LAST_UPDATE),
      ADMIN_STATUS: admin.ADMIN_STATUS,
    };
  });

  const paginationModel = { page: 0, pageSize: 10 };

  //edit
  const handleEditRow = (row: admin) => {
    setSelectedRowEdit(row);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: any) => {
    //console.log(updatedRow.id);
    try {
      // Crear objeto para actualizar el administrador
      const adminDataToSend = {
        ADMIN_ID: updatedRow.id,
        ADMIN_NAME: updatedRow.ADMIN_NAME,
        ADMIN_PA_LAST_NAME: updatedRow.ADMIN_PA_LAST_NAME,
        ADMIN_MA_LAST_NAME: updatedRow.ADMIN_MA_LAST_NAME,
      };

      // Actualizar admin
      const adminResponse = await fetch(
        `http://localhost:8000/api/admins/${adminDataToSend.ADMIN_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminDataToSend),
        }
      );

      if (!adminResponse.ok) {
        throw new Error(`Failed to update admin: ${adminResponse.statusText}`);
      }

      // Crear objeto para actualizar el usuario
      const userDataToSend = {
        USER_EMAIL: updatedRow.USER_EMAIL,
        USER_PASSWORD: updatedRow.USER_PASSWORD,
      };

      // Aquí suponemos que el ADMIN_ID es igual al USER_ID
      const userResponse = await fetch(
        `http://localhost:8000/api/users/${adminDataToSend.ADMIN_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDataToSend),
        }
      );

      if (!userResponse.ok) {
        throw new Error(`Failed to update user: ${userResponse.statusText}`);
      }
      // datos de la alertra
      setAlertMessage("Administrator actualizado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      // Recargar la página para mostrar los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating admin or user:", error);
      setAlertMessage("Error al actualizar el administrador");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false); // Cerrar el diálogo
      setSelectedRowEdit(null); // Limpiar el estado seleccionado
    }
  };

  //delete
  const handleDeleteRow = (row: admin) => {
    setSelectedRowDel(row);
    setOpenDelDialog(true);
  };

  const handleDeleteSubmit = async (deletedRow: any) => {
    //console.log(deletedRow.id);
    try {
      // Actualizar el estado del administrador a 0
      const adminDataToSend = {
        ADMIN_ID: deletedRow.id,
        ADMIN_STATUS: 0,
      };

      const adminUrl = `http://localhost:8000/api/admins/${adminDataToSend.ADMIN_ID}`;

      const adminResponse = await fetch(adminUrl, {
        method: "PUT", // Cambia a PUT ya que estamos actualizando el status, no eliminando
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminDataToSend),
      });

      if (!adminResponse.ok) {
        throw new Error(
          `Failed to update admin status: ${adminResponse.statusText}`
        );
      }

      // Actualizar el estado del usuario a 0 (asumiendo que ADMIN_ID = USER_ID)
      const userDataToSend = {
        USER_STATUS: 0,
      };

      const userUrl = `http://localhost:8000/api/users/${adminDataToSend.ADMIN_ID}`;

      const userResponse = await fetch(userUrl, {
        method: "PUT", // PUT para actualizar el usuario
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataToSend),
      });

      if (!userResponse.ok) {
        throw new Error(
          `Failed to update user status: ${userResponse.statusText}`
        );
      }
      // datos de la alertra
      setAlertMessage("Administrator eliminado correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
      // Recargar la página después de la actualización
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating admin or user status:", error);
      setAlertMessage("Error al eliminar el administrador");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenDelDialog(false); // Cerrar el diálogo
      setSelectedRowDel(null); // Limpiar la fila seleccionada
    }
  };

  //activate
  const handleActivateRow = (row: admin) => {
    setSelectedRowActive(row);
    setOpenActivateDialog(true);
  };

  const handleActivateSubmit = async (activatedRow: any) => {
    //console.log(activatedRow.id);
    try {
      // Actualizar el estado del administrador a 1
      const adminDataToSend = {
        ADMIN_ID: activatedRow.id,
        ADMIN_STATUS: 1,
      };

      const adminUrl = `http://localhost:8000/api/admins/${adminDataToSend.ADMIN_ID}`;

      const adminResponse = await fetch(adminUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminDataToSend),
      });

      if (!adminResponse.ok) {
        throw new Error(
          `Failed to activate admin: ${adminResponse.statusText}`
        );
      }

      // Actualizar el estado del usuario relacionado a 1 (asumiendo que ADMIN_ID = USER_ID)
      const userDataToSend = {
        USER_STATUS: 1,
      };

      const userUrl = `http://localhost:8000/api/users/${adminDataToSend.ADMIN_ID}`; // Usa ADMIN_ID para actualizar USER_ID correspondiente

      const userResponse = await fetch(userUrl, {
        method: "PUT", // PUT para actualizar el usuario
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataToSend),
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to activate user: ${userResponse.statusText}`);
      }
      // datos de la alertra
      setAlertMessage("Administrator reactivado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      // Recargar la página después de la actualización
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error activating admin or user:", error);
      setAlertMessage("Error al reactivar el administrador");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenActivateDialog(false); // Cerrar el diálogo
      setSelectedRowActive(null); // Limpiar la fila seleccionada
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
          <Typography variant="h6">ADMINISTRADORES</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.ADMIN_STATUS === 0 ? "inactive-row" : ""
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
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.ADMIN_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      ADMIN_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Paterno"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.ADMIN_PA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      ADMIN_PA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Materno"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.ADMIN_MA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      ADMIN_MA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Correo"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.USER_EMAIL}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      USER_EMAIL: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Contraseña"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.USER_PASSWORD}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      USER_PASSWORD: e.target.value,
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
        <Dialog open={openDelDialog} onClose={() => setOpenDelDialog(false)}>
          <DialogTitle>Eliminar Administrador</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea eliminar este administrador?
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
          <DialogTitle>Reactivar Administrador</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea reactivar este administrador?
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

export default Administrators;
