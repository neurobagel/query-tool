import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertTitle, Grow } from '@mui/material';
import { ToastProps } from '../utils/types';
import { useSnackStack } from './SnackStackProvider';

const TIMEOUT = 300;

function SnackbarToast({ toast }: { toast: ToastProps }) {
  const [open, setOpen] = useState(true);
  const { removeToast } = useSnackStack();

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      removeToast(toast.key);
    }, TIMEOUT);
  }, [toast.key, removeToast]);

  function handleClose() {
    if (toast?.onClose) {
      toast.onClose();
    }
    close();
  }

  useEffect(() => {
    if (toast.duration !== 0) {
      setTimeout(() => {
        close();
      }, toast.duration || 5000);
    }
  }, [close, toast.duration]);

  return (
    <Grow in={open} timeout={TIMEOUT}>
      <Alert
        key={toast.key}
        severity={toast?.severity || 'info'}
        onClose={() => handleClose()}
        variant="filled"
      >
        {toast?.title && <AlertTitle>{toast.title}</AlertTitle>}
        {toast?.message}
        {toast?.children}
      </Alert>
    </Grow>
  );
}

export default SnackbarToast;
