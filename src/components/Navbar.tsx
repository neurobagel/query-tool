import { useState, useEffect } from 'react';
import { Toolbar, Typography, IconButton, Badge } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';



function Navbar() {
  const [latestReleaseTag, setLatestReleaseTag] = useState('');

  useEffect(() => {
    async function fetchLatestRelease() {
      // TODO: replace with reac-query-tool once there is a release
      const GHApiURL = 'https://api.github.com/repos/neurobagel/query-tool/releases/latest';
      try {
        const response = await fetch(GHApiURL);
        const data = await response.json();
        setLatestReleaseTag(data.tag_name);
      } catch (error) {
        console.error('Failed to fetch latest release:', error);
      }
    }

    fetchLatestRelease();
  }, [])
  return (
    <Toolbar className='my-4'>
      <div className="flex justify-between items-center w-full">
        <div className='flex items-center'>
          <img src="https://raw.githubusercontent.com/neurobagel/documentation/main/docs/imgs/logo/neurobagel_logo.png" alt="Logo" height="60" />
          <div className='ml-4'>
            <Badge badgeContent={latestReleaseTag}>
              <Typography variant="h5">
                Neurobagel Query
              </Typography>
            </Badge>
            <Typography variant="body1" className="text-gray-500">
              Define and find cohorts at the subject level
            </Typography>
          </div>
        </div>
        <div className='flex'>
          <IconButton size='small' href='https://neurobagel.org/query_tool/' target='_blank'>
            Documentation
          </IconButton>
          <IconButton href="https://github.com/neurobagel/react-query-tool/" target='_blank'>
            <GitHubIcon />
          </IconButton>
        </div>
      </div>
    </Toolbar>
  );
};

export default Navbar;