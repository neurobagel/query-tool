import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';

function AuthDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { loginWithRedirect } = useAuth0();

  return (
    <Dialog open={open} onClose={onClose} data-cy="auth-dialog">
      <DialogTitle>
        You must log in to a trusted identity provider in order to query all available nodes!
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col items-center justify-center">
          <button type="button" onClick={() => loginWithRedirect()}>
            Log In
          </button>
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
