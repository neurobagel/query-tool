import DownloadIcon from '@mui/icons-material/Download';
import { Button, Tooltip, Typography } from '@mui/material';

function DownloadResultButton({
  identifier,
  disabled,
  handleClick,
}: {
  identifier: string;
  disabled: boolean;
  handleClick: (identifier: string) => void;
}) {
  const button = (
    <Button
      data-cy={`${identifier}-download-results-button`}
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={() => handleClick(identifier)}
      disabled={disabled}
    >
      Download {identifier.split('-').join(' ')} result
    </Button>
  );

  return disabled ? (
    <Tooltip
      title={<Typography variant="body1">Please select at least one dataset</Typography>}
      placement="top"
    >
      <span>{button}</span>
    </Tooltip>
  ) : (
    button
  );
}

export default DownloadResultButton;
