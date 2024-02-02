import { useState } from 'react';
import TextField from '@mui/material/TextField';

export interface ContinuousFieldProps {
  min: number;
  max?: number | null;
  label: string;
  onFieldChange: (fieldLabel: string, value: number | null) => void;
}

function ContinuousField({ min, max, label, onFieldChange }: ContinuousFieldProps) {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  function validate(value: string) {
    const numberValue: number = parseFloat(value);
    if (Number.isNaN(numberValue) && value !== '') {
      setError(true);
      setHelperText('Value must be a number');
      onFieldChange(label, null);
      return;
    }
    if (numberValue < min) {
      setError(true);
      setHelperText(`Value must be greater than or equal to ${min}`);
    } else if (max && numberValue > max) {
      setError(true);
      setHelperText(`Value must be less than or equal to ${max}`);
    } else {
      setError(false);
      setHelperText('');
    }
    onFieldChange(label, numberValue);
  }
  return (
    <TextField
      error={error}
      label={label}
      className="w-full"
      onChange={(event) => validate(event.target.value)}
      helperText={error ? helperText : ''}
    />
  );
}

ContinuousField.defaultProps = {
  max: null,
};

export default ContinuousField;
