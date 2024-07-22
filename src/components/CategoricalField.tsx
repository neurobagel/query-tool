import { Autocomplete, TextField } from '@mui/material';
import { CategoricalFieldProps } from '../utils/types';

function CategoricalField({
  label,
  options,
  onFieldChange,
  multiple = false,
  inputValue,
  disabled = false,
}: CategoricalFieldProps) {
  return (
    <Autocomplete
      data-cy={`${label}-categorical-field`}
      options={options.sort((a, b) => a.label.localeCompare(b.label))}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={inputValue}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label={label}
          placeholder="Select an option"
          className="w-full"
        />
      )}
      multiple={multiple}
      onChange={(_, value) => onFieldChange(label, value)}
      disabled={disabled}
    />
  );
}

export default CategoricalField;
