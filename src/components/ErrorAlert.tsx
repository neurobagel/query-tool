import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';

import type { AlertColor } from '@mui/material/Alert';

interface ErrorAlertProps {
  errorTitle: string;
  explanation: string;
  errorMessage?: string;
  severity?: AlertColor;
}

function ErrorAlert({ errorTitle, explanation, errorMessage, severity }: ErrorAlertProps) {
  return (
    <Alert severity={severity} data-cy="error-alert">
      <AlertTitle>{errorTitle}</AlertTitle>

      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        {explanation}
      </Typography>

      {errorMessage && (
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
          {errorMessage}
        </Typography>
      )}
    </Alert>
  );
}

ErrorAlert.defaultProps = {
  errorMessage: undefined,
  severity: 'error',
};

export default ErrorAlert;
