import { Autocomplete, TextField } from '@mui/material';
import { CategoricalFieldProps } from '../utils/types';

function CategoricalField({
  label,
  options,
  onFieldChange,
  multiple,
  inputValue,
  disabled,
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
        />
      )}
      multiple={multiple}
      onChange={(_, value) => onFieldChange(label, value)}
      disabled={disabled}
    />
  );
}

CategoricalField.defaultProps = {
  multiple: false,
  disabled: false,
};

export default CategoricalField;
