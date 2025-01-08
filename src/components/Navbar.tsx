import { useState } from 'react';
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import Article from '@mui/icons-material/Article';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import { useAuth0 } from '@auth0/auth0-react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { enableAuth } from '../utils/constants';
import packageJson from '../../package.json';
import logo from '../assets/logo.png';

function Navbar({
  isLoggedIn,
  onLogin,
  notifications,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  notifications: string[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorEl);

  const { user, logout } = useAuth0();
  const [anchorMailEl, setAnchorMailEl] = useState<null | HTMLElement>(null);
  const openMailMenu = Boolean(anchorMailEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMailClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMailEl(event.currentTarget);
  };

  const handleMailClose = () => {
    setAnchorMailEl(null);
  };

  return (
    <Toolbar className="my-4" data-cy="navbar">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Logo" height="60" />
          <div className="ml-4">
            <Badge badgeContent={packageJson.version || 'beta'}>
              <Typography variant="h5">Neurobagel Query</Typography>
            </Badge>
            <Typography className="text-gray-500">
              Define and find cohorts at the subject level
            </Typography>
          </div>
        </div>
        <div className="flex">
          <Tooltip title="Documentation">
            <IconButton
              size="small"
              href="https://neurobagel.org/user_guide/query_tool/"
              target="_blank"
            >
              <Article />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton onClick={handleMailClick}>
              <Badge badgeContent={notifications.length} color="primary">
                <NotificationsIcon color="action" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Popover
            open={openMailMenu}
            anchorEl={anchorMailEl}
            onClose={handleMailClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '10px',
              },
            }}
          >
            <List className="w-full max-w-[360px] overflow-y-auto bg-white">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <ListItem
                    key={notification}
                    alignItems="flex-start"
                    className="mb-2 rounded-md border-l-4 border-[#FF9800] bg-[#FFF3E0] transition-colors duration-200 hover:bg-gray-200"
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" className="font-bold text-[#E65100]">
                          {/* Add the appropriate title for the notification if any */}
                        </Typography>
                      }
                      secondary={
                        <Typography className="inline text-[#424242]" variant="body2">
                          {notification}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        className="text-[#FF5722] hover:bg-[#FF572220]"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1" className="text-center italic text-[#757575]">
                        No notifications
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Popover>

          <IconButton href="https://github.com/neurobagel/query-tool/" target="_blank">
            <GitHub />
          </IconButton>

          {enableAuth && (
            <>
              <IconButton onClick={handleClick}>
                <Avatar
                  src={user?.picture ?? ''}
                  sx={{ width: 30, height: 30 }}
                  alt={user?.name ?? ''}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openAccountMenu}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MenuItem>
                    <Avatar src={user?.picture ?? ''} alt={user?.name ?? ''} />
                  </MenuItem>
                </div>
                {isLoggedIn ? (
                  <>
                    <MenuItem>
                      <Typography>Logged in as {user?.name ?? ''}</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                      <ListItemIcon className="mr-[-8px]">
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={onLogin} data-cy="login-button">
                    <ListItemIcon className="mr-[-8px]">
                      <Login fontSize="small" />
                    </ListItemIcon>
                    Login
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </div>
      </div>
    </Toolbar>
  );
}

export default Navbar;
