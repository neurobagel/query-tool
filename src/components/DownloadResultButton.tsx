import DownloadIcon from '@mui/icons-material/Download';
import { Button, Tooltip, Typography } from '@mui/material';

function DownloadResultButton({
  identifier,
  disabled,
  handleClick,
}: {
  identifier: string;
  disabled: boolean;
  handleClick: () => void;
}) {
  if (disabled) {
    return (
      <Tooltip
        title={<Typography variant="body1">Please select at least one dataset</Typography>}
        placement="top"
      >
        <span>
          <Button variant="contained" startIcon={<DownloadIcon />} disabled>
            Download {identifier} Result
          </Button>
        </span>
      </Tooltip>
    );
  }
  return (
    <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleClick}>
      Download {identifier} Result
    </Button>
  );
}

export default DownloadResultButton;
