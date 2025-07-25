import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';

interface ErrorAlertProps {
  errorTitle: string;
  errorMessage: string;
}

function ErrorAlert({ errorTitle, errorMessage }: ErrorAlertProps) {
  return (
    <Alert severity="error" data-cy="error-alert">
      <AlertTitle>{errorTitle}</AlertTitle>
      <Typography
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
          fontSize: '0.875rem',
          lineHeight: 1.4,
        }}
      >
        {errorMessage}
      </Typography>
    </Alert>
  );
}

export default ErrorAlert;
