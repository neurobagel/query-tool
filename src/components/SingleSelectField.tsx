import { Autocomplete, TextField } from '@mui/material';
import { FieldInputOption } from '../utils/types';

export interface SingleSelectFieldProps {
  label: string;
  options: FieldInputOption[];
  onFieldChange: (fieldLabel: string, value: FieldInputOption | null) => void;
  value: FieldInputOption | null;
  disabled?: boolean;
}

/**
 * A reusable single-select categorical input field built on MUI Autocomplete.
 *
 * Renders a searchable dropdown for mutually exclusive options sorted alphabetically.
 * Dispatches changes via `onFieldChange` with the selected `FieldInputOption` or `null` if cleared.
 */
function SingleSelectField({
  label,
  options,
  onFieldChange,
  value,
  disabled = false,
}: SingleSelectFieldProps) {
  const sortedOptions = [...options].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Autocomplete
      data-cy={`${label}-categorical-field`}
      options={sortedOptions}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      value={value}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Select an option" />
      )}
      onChange={(_, newValue) => onFieldChange(label, newValue)}
      disabled={disabled}
    />
  );
}

export default SingleSelectField;
