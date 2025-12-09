import { useState } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';

type Props = {
  disabled: boolean;
  handleClick: (index: number) => void;
  loading: boolean;
};

export function DownloadResultButton({ disabled, handleClick, loading }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onDownload = () => {
    handleClick(selectedIndex);
  };

  const onRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement).value;
    if (val === 'labels') setSelectedIndex(0);
    else setSelectedIndex(1);
  };

  const control = (
    <Box sx={{ display: 'inline-block' }}>
      <Stack spacing={1} alignItems="flex-start" sx={{ width: 'fit-content' }}>
        <Button
          variant="contained"
          onClick={onDownload}
          disabled={disabled || loading}
          data-cy="download-results-button"
          aria-label="Download selected query results"
          sx={{ width: '100%', textTransform: 'none' }}
        >
          {loading ? (
            <>
              Downloading...
              <CircularProgress size={16} color="inherit" sx={{ ml: 1 }} />
            </>
          ) : (
            'Download'
          )}
        </Button>

        <FormControl component="fieldset" sx={{ mt: 0.5 }} disabled={disabled || loading}>
          <RadioGroup
            aria-label="download-format"
            name="download-format"
            value={selectedIndex === 0 ? 'labels' : 'uris'}
            onChange={onRadioChange}
          >
            <FormControlLabel
              value="labels"
              control={<Radio size="small" />}
              label={<Typography variant="body2">Include term labels</Typography>}
              data-cy="download-radio-0"
            />
            <FormControlLabel
              value="uris"
              control={<Radio size="small" />}
              label={<Typography variant="body2">Include term URIs</Typography>}
              data-cy="download-radio-1"
            />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Box>
  );

  return disabled ? (
    <Tooltip
      title={<Typography variant="body1">Please select at least one dataset</Typography>}
      placement="top"
    >
      <span>{control}</span>
    </Tooltip>
  ) : (
    control
  );
}

export default DownloadResultButton;
