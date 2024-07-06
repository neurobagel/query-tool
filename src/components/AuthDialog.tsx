import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';
// import { GoogleJWT } from '../utils/types';

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
        {/* TODO move this style to style sheet */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GoogleLogin onSuccess={(response) => onAuth(response.credential)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
