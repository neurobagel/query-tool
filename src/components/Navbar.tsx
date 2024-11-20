import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import Article from '@mui/icons-material/Article';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import { enableAuth } from '../utils/constants';
import logo from '../assets/logo.png';

function Navbar({
  isLoggedIn,
  name,
  profilePic,
  onLogout,
  onLogin,
}: {
  isLoggedIn: boolean;
  name: string;
  profilePic: string;
  onLogout: () => void;
  onLogin: () => void;
}) {
  const [latestReleaseTag, setLatestReleaseTag] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorEl);

  useEffect(() => {
    const GHApiURL = 'https://api.github.com/repos/neurobagel/query-tool/releases/latest';
    axios
      .get(GHApiURL)
      .then((response) => {
        const { data } = response;
        setLatestReleaseTag(data.tag_name);
      })
      .catch(() => {
        setLatestReleaseTag('beta');
      });
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar className="my-4" data-cy="navbar">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Logo" height="60" />
          <div className="ml-4">
            <Badge badgeContent={latestReleaseTag}>
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
          <IconButton href="https://github.com/neurobagel/query-tool/" target="_blank">
            <GitHub />
          </IconButton>
          {enableAuth && (
            <>
              <IconButton onClick={handleClick}>
                <Avatar src={profilePic} sx={{ width: 30, height: 30 }} alt={name} />
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
                    <Avatar src={profilePic} alt={name} />
                  </MenuItem>
                </div>
                {isLoggedIn ? (
                  <>
                    <MenuItem>
                      <Typography>Logged in as {name}</Typography>
                    </MenuItem>
                    <MenuItem onClick={onLogout}>
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
