import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DownloadResultButton from './DownloadResultButton';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} data-cy="get-data-dialog">
      <DialogTitle>Example usage</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please follow the steps below
          <ol>
            <li>Select at least one dataset</li>
            <li>Download the cohort results for machines using the button below</li>
            <li>Change directory to the location of the downloaded files</li>
            <li>Copy and run the command below</li>
          </ol>
        </DialogContentText>
        <div className="mb-4 flex justify-center">
          <DownloadResultButton
            identifier="cohort participant machine"
            disabled={disableDownloadResultsButton}
            handleClick={(identifier) => handleDownloadResultButtonClick(identifier)}
          />
        </div>
        <DialogContentText>
          <code className="text-black">
            docker run -t -v $(pwd):/data neurobagel/dataget:latest /data/dataset-level-results.tsv
            /data/participant-level-results.tsv /data/output
          </code>
          <br />
          <br />
          The downloaded data will be saved in a directory called output in the current directory.
          Note that the output directory will be created if it does not exist already.
          <br />
          ⚠️ The command for automatically getting the data currently only applies to datasets
          available through datalad.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-cy="get-data-dialog-close-button" onClick={() => onClose()} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GetDataDialog;
