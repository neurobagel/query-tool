import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import CircularProgress from '@mui/material/CircularProgress';

const options = ['Download selected query results', 'Download selected query results with URIs'];

function DownloadResultButton({
  disabled,
  handleClick,
  loading,
}: {
  disabled: boolean;
  handleClick: (index: number) => Promise<void>;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const handleDownloadClick = async () => {
    handleClick(selectedIndex);
  };

  const button = (
    <>
      <ButtonGroup disabled={disabled || loading} variant="contained" ref={anchorRef}>
        <Button onClick={handleDownloadClick} data-cy="download-results-button">
          {loading ? (
            <>
              Downloading selected query results
              <CircularProgress size={16} color="inherit" sx={{ ml: 1 }} />
            </>
          ) : (
            options[selectedIndex]
          )}
        </Button>
        <Button data-cy="download-results-dropdown-button" size="small" onClick={handleToggle}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );

  return disabled ? (
    <Tooltip
      title={<Typography variant="body1">Please select at least one dataset</Typography>}
      placement="top"
    >
      <span>{button}</span>
    </Tooltip>
  ) : (
    button
  );
}

export default DownloadResultButton;
