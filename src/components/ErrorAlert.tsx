import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import type { AlertColor } from '@mui/material/Alert';

interface ErrorAlertProps {
  errorTitle: string;
  errorExplanation: string;
  errorContent?: string;
  severity?: AlertColor;
}

function ErrorAlert({ errorTitle, errorExplanation, errorContent, severity }: ErrorAlertProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Alert
        severity={severity}
        data-cy="error-alert"
        action={
          <Button color="inherit" size="small" variant="contained" onClick={() => setOpen(!open)}>
            {open ? 'Collapse' : 'Expand'}
          </Button>
        }
      >
        <AlertTitle>{errorTitle}</AlertTitle>
        <Collapse in={open}>
          <Typography variant="body2">{errorExplanation}</Typography>
        </Collapse>
      </Alert>

      <Collapse in={open}>
        {errorContent && (
          <Typography
            data-cy="error-container"
            component="pre"
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              padding: 1,
              borderRadius: 1,
              margin: 0,
              fontSize: '0.6rem',
              lineHeight: 1.4,
              maxHeight: '30vh',
              overflow: 'auto',
            }}
          >
            {errorContent}
          </Typography>
        )}
      </Collapse>
    </>
  );
}

ErrorAlert.defaultProps = {
  errorContent: undefined,
  severity: 'error',
};

export default ErrorAlert;
