import { Autocomplete, TextField } from '@mui/material';
import { CategoricalFieldProps } from '../utils/types';

function CategoricalField({
    label,
    options,
    onFieldChange,
    multiple,
    inputValue,
  }: CategoricalFieldProps) {
  
    return (
      <Autocomplete
        options={options.sort((a, b) => a.label.localeCompare(b.label))}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={inputValue}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            InputLabelProps={params.InputLabelProps}
            label={label}
            placeholder='Select an option'
            className='w-full'
          />
        )}
        multiple={multiple}
        onChange={(_, value) => onFieldChange(label, value)}
      />
    );
  }
  
  CategoricalField.defaultProps = {
    multiple: false,
  };

  export default CategoricalField;