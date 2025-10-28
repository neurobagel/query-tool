import TextField from '@mui/material/TextField';

export interface ContinuousFieldProps {
  helperText?: string;
  label: string;
  value: string;
  onFieldChange: (fieldLabel: string, value: string) => void;
}

function ContinuousField({ helperText, label, value, onFieldChange }: ContinuousFieldProps) {
  const normalizedHelperText = helperText ?? '';
  const showError: boolean = normalizedHelperText !== '';

  return (
    <TextField
      data-cy={`${label}-continuous-field`}
      error={showError}
      label={label}
      className="w-full"
      value={value}
      onChange={(event) => onFieldChange(label, event.target.value)}
      helperText={normalizedHelperText}
    />
  );
}

export default ContinuousField;
