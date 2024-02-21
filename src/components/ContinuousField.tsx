import TextField from '@mui/material/TextField';

export interface ContinuousFieldProps {
  helperText?: string;
  label: string;
  onFieldChange: (fieldLabel: string, value: number | null) => void;
}

function ContinuousField({ helperText, label, onFieldChange }: ContinuousFieldProps) {
  const showError: boolean = helperText !== '';
  return (
    <TextField
      data-cy={`${label}-continuous-field`}
      error={showError}
      label={label}
      className="w-full"
      onChange={(event) => onFieldChange(label, event.target.value === '' ? null : parseInt(event.target.value, 10))}
      helperText={helperText}
    />
  );
}

ContinuousField.defaultProps = {
  helperText: '',
};

export default ContinuousField;
