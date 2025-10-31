import TextField from '@mui/material/TextField';

export interface ContinuousFieldProps {
  errorText: string;
  label: string;
  value: string;
  onFieldChange: (fieldLabel: string, value: string) => void;
}

function ContinuousField({ errorText, label, value, onFieldChange }: ContinuousFieldProps) {
  const showError: boolean = errorText !== '';

  return (
    <TextField
      data-cy={`${label}-continuous-field`}
      error={showError}
      label={label}
      className="w-full"
      value={value}
      onChange={(event) => onFieldChange(label, event.target.value)}
      helperText={errorText}
    />
  );
}

export default ContinuousField;
