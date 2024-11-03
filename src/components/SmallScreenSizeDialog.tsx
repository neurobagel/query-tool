import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

function SmallScreenSizeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} data-cy="screen-size-dialog">
      <DialogTitle className="flex flex-row gap-x-1">
        <WarningIcon color="warning" /> Unsupported Screen Size!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          We&apos;re sorry, but the Query Tool is not optimized for use on smaller screens. For the
          best experience, please access this tool on a device with a larger screen, such as a
          tablet, laptop, or desktop computer. Thank you for your understanding!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-cy="close-screen-size-dialog-button">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SmallScreenSizeDialog;
