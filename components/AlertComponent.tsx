import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton, Snackbar, LinearProgress, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface AlertComponentProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
  onClose: () => void;
  isConfirmation?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
  open,
  message,
  severity,
  autoHideDuration,
  onClose,
  isConfirmation = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (open && autoHideDuration && !isConfirmation) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = autoHideDuration - elapsed;
        if (remaining <= 0) {
          clearInterval(interval);
          onClose();
        } else {
          setProgress((remaining / autoHideDuration) * 100);
        }
      }, 50);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [open, autoHideDuration, isConfirmation, onClose]);

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'info':
        return <InfoIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      default:
        return null;
    }
  };

  if (isConfirmation) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </DialogTitle>
        <DialogContent>
          {message}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="inherit">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} color="primary">
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert
        severity={severity}
        icon={getIcon()}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          width: '100%',
          maxWidth: 600,
          position: 'relative',
        }}
      >
        <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle>
        {message}
        {autoHideDuration && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
