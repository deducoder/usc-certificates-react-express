import { Alert, Snackbar } from "@mui/material";

interface AlertMessageProps {
  message: string;
  severity: AlertColor;
  open: boolean;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  severity,
  open,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
