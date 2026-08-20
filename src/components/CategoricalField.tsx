import { Autocomplete, TextField } from '@mui/material';
import { CategoricalFieldProps, CategoricalFieldOption } from '../utils/types';

function CategoricalField({
  label,
  options,
  onFieldChange,
  multiple = false,
  inputValue,
  disabled = false,
  groupBy,
}: CategoricalFieldProps) {
  const normalizedValue = multiple
    ? Array.isArray(inputValue)
      ? inputValue
      : inputValue
        ? [inputValue]
        : []
    : Array.isArray(inputValue)
      ? (inputValue[0] ?? null)
      : inputValue;

  const hasGroups = options.some((opt) => opt.group != null);
  const sortedOptions = [...options].sort((a, b) => {
    if (a.group && b.group && a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }
    return a.label.localeCompare(b.label);
  });

  return (
    <Autocomplete
      data-cy={`${label}-categorical-field`}
      options={sortedOptions}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={normalizedValue}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Select an option" />
      )}
      multiple={multiple}
      groupBy={
        groupBy || (hasGroups ? (option: CategoricalFieldOption) => option.group ?? '' : undefined)
      }
      onChange={(_, value) => onFieldChange(label, value)}
      disabled={disabled}
    />
  );
}

export default CategoricalField;
