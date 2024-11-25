import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Popover,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTheme } from '@mui/material/styles';
import DownloadResultButton from './DownloadResultButton';
import NBTheme from '../theme';

function GetDataDialog({
  open,
  onClose,
  disableDownloadResultsButton,
  handleDownloadResultButtonClick,
}: {
  open: boolean;
  onClose: () => void;
  disableDownloadResultsButton: boolean;
  handleDownloadResultButtonClick: (identifier: string) => void;
}) {
  const DOCKER_RUN_COMMAND =
    'docker run -t -v $(pwd):/data neurobagel/dataget:latest /data/cohort-participant-machine-results.tsv /data/output';
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  const handleCopyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(DOCKER_RUN_COMMAND);
    setAnchorEl(event.currentTarget);
    setShowPopover(true);

    setTimeout(() => {
      setShowPopover(false);
    }, 2000);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowPopover(false);
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} data-cy="get-data-dialog">
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6" className="font-bold">
            Results file for data access or programmatic use
          </Typography>
          Below is a machine-optimized version of your selected query results, which we recommend
          using as input to scripts for downloading the data of matching subjects to your local
          filesystem. This file also contains URIs instead of descriptive labels, making it ideal
          for integration with other tools for linked or structured data:
          <div className="m-4 flex justify-center">
            <DownloadResultButton
              identifier="cohort-participant-machine"
              disabled={disableDownloadResultsButton}
              handleClick={(identifier) => handleDownloadResultButtonClick(identifier)}
            />
          </div>
          <Typography variant="h6" className="font-bold">
            Download matching results from DataLad datasets
          </Typography>
          We have a helper tool to automatically download matching subjects from datasets available
          through DataLad. To do so:
          <ol>
            <li>Select at least one dataset</li>
            <li>Download the cohort results for machines using the above button</li>
            <li>Change directory to the location of the downloaded TSV</li>
            <li>Copy and run the command below</li>
          </ol>
        </DialogContentText>
        <DialogContentText>
          <div className="flex items-center rounded bg-gray-200 px-2 py-1 text-sm">
            <code className="flex-grow text-black">{DOCKER_RUN_COMMAND}</code>
            <IconButton
              color="primary"
              onClick={handleCopyClick}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            <Popover
              open={showPopover}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Typography
                className="rounded px-2 py-1 text-sm text-white shadow"
                sx={{ backgroundColor: NBTheme.palette.primary.main }}
              >
                Copied!
              </Typography>
            </Popover>
          </div>
          <br />
          The downloaded data will be saved in the current directory, in a subdirectory called
          &quot;output&quot;. (Note: this directory will be created if it does not already exist)
          <br />
          ⚠️ The above command currently only gets data for DataLad datasets. To download a cohort
          from other remote filesystems you have access to, you may need to write your own script
          that uses the paths from the results file downloadable above.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-cy="get-data-dialog-close-button" onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GetDataDialog;
