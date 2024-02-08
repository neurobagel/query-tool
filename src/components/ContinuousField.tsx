import TextField from '@mui/material/TextField';

export interface ContinuousFieldProps {
  error?: boolean;
  helperText?: string;
  label: string;
  onFieldChange: (fieldLabel: string, value: string) => void;
}

function ContinuousField({ error, helperText, label, onFieldChange }: ContinuousFieldProps) {
  return (
      <TextField
        data-cy={`${label}-continuous-field`}
        error={error}
        label={label}
        className="w-full"
        onChange={(event) => onFieldChange(label, event.target.value)}
        helperText={helperText}
      />
  );
}

ContinuousField.defaultProps = {
  error: false,
  helperText: '',
};

export default ContinuousField;
