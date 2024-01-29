import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function NBDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={() => onClose()}>
      <DialogTitle>Example usage</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please follow the steps below
          <ol>
            <li>Select at least one dataset</li>
            <li>Download the participant-level and dataset-level results files</li>
            <li>Change directory to the location of the downloaded files</li>
            <li>Copy and run the following command:</li>
          </ol>
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
        <Button onClick={() => onClose()} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NBDialog;
