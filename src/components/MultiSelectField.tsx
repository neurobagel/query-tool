import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { FieldInputOption } from '../utils/types';

export interface MultiSelectFieldProps {
  label: string;
  options: FieldInputOption[];
  onFieldChange: (fieldLabel: string, value: FieldInputOption[]) => void;
  value: FieldInputOption[];
  disabled?: boolean;
}

/**
 * A reusable multi-select categorical input field built on MUI Autocomplete.
 *
 * Renders a searchable dropdown with checkbox-enabled options sorted alphabetically.
 * Dispatches changes via `onFieldChange` with the updated list of `FieldInputOption` items.
 */
function MultiSelectField({
  label,
  options,
  onFieldChange,
  value,
  disabled = false,
}: MultiSelectFieldProps) {
  const sortedOptions = [...options].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      data-cy={`${label}-categorical-field`}
      options={sortedOptions}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      value={value}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Select an option" />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox size="small" sx={{ mr: 1 }} checked={selected} />
          {option.label}
        </li>
      )}
      onChange={(_, newValue) => onFieldChange(label, newValue)}
      disabled={disabled}
    />
  );
}

export default MultiSelectField;
