interface ErrorAlertProps {
  errorTitle: string;
  errorMessage: string;
}

function ErrorAlert({ errorTitle, errorMessage }: ErrorAlertProps) {
  return (
    <div data-cy="error-alert">
      <h1>{errorTitle}</h1>
      <p>{errorMessage}</p>
    </div>
  );
}

export default ErrorAlert;
