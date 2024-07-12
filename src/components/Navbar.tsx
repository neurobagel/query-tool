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
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { enableAuth } from '../utils/constants';

function Navbar({
  name,
  profilePic,
  onLogout,
}: {
  name: string;
  profilePic: string;
  onLogout: () => void;
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
          <img
            src="https://raw.githubusercontent.com/neurobagel/documentation/main/docs/imgs/logo/neurobagel_logo.png"
            alt="Logo"
            height="60"
          />
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
          <IconButton size="small" href="https://neurobagel.org/query_tool/" target="_blank">
            <Typography>Documentation</Typography>
          </IconButton>
          <IconButton href="https://github.com/neurobagel/react-query-tool/" target="_blank">
            <GitHubIcon />
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
                <MenuItem>
                  <Typography>Logged in as {name}</Typography>
                </MenuItem>
                <MenuItem onClick={onLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </Toolbar>
  );
}

export default Navbar;
