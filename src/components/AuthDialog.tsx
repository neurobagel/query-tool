import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { GoogleLogin } from '@react-oauth/google';

function AuthDialog({
  open,
  onAuth,
  onClose,
}: {
  open: boolean;
  onAuth: (credential: string | undefined) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} data-cy="auth-dialog">
      <DialogTitle>
        You must log in to a trusted identity provider in order to query all available nodes!
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col items-center justify-center">
          <GoogleLogin onSuccess={(response) => onAuth(response.credential)} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-cy="close-auth-dialog-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AuthDialog;
