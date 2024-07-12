import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';

function AuthDialog({
  isLoggedIn,
  onAuth,
}: {
  isLoggedIn: boolean;
  onAuth: (credential: string | undefined) => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog fullScreen={fullScreen} open={!isLoggedIn} data-cy="get-data-dialog">
      <DialogTitle>Please login using one of the following before proceeding</DialogTitle>
      <DialogContent>
        <div className="flex flex-col items-center justify-center">
          <GoogleLogin onSuccess={(response) => onAuth(response.credential)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
