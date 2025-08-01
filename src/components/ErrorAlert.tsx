import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import type { AlertColor } from '@mui/material/Alert';
import CodeBlock from './CodeBlock';

interface ErrorAlertProps {
  errorTitle: string;
  errorExplanation: React.ReactNode;
  errorContent?: string;
  severity?: AlertColor;
}

function ErrorAlert({
  errorTitle,
  errorExplanation,
  errorContent = undefined,
  severity = 'error',
}: ErrorAlertProps) {
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

      <Collapse in={open}>{errorContent && <CodeBlock code={errorContent} />}</Collapse>
    </>
  );
}

export default ErrorAlert;
