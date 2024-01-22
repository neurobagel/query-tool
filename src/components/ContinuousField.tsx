import TextField from '@mui/material/TextField';

function ContinuousField({
    label,
    onFieldChange,
  }: {
    label: string;
    onFieldChange: (fieldLabel: string, value: string) => void;
  }) {
    return (
      // TODO: see if we can make it so TextField returns type number instead of string as its doing now
      <TextField
        type='number'
        label={label}
        className='w-full'
        onChange={(event) => onFieldChange(label, event.target.value)}
      />
    );
  }

  export default ContinuousField;