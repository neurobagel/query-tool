import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';

interface ErrorAlertProps {
  errorTitle: string;
  explanation: string;
  errorMessage?: string;
}

function ErrorAlert({ errorTitle, explanation, errorMessage }: ErrorAlertProps) {
  return (
    <Alert severity="error" data-cy="error-alert">
      <AlertTitle>{errorTitle}</AlertTitle>

      {explanation}

      {errorMessage && (
        <Typography
          data-cy="error-container"
          component="pre"
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
};

export default ErrorAlert;
