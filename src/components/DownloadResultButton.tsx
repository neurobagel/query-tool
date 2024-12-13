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

const options = ['Download selected query results', 'Download selected query results with URIs'];

function DownloadResultButton({
  disabled,
  handleClick,
}: {
  disabled: boolean;
  handleClick: (index: number) => void;
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

  const button = (
    <>
      <ButtonGroup disabled={disabled} variant="contained" ref={anchorRef}>
        <Button onClick={() => handleClick(selectedIndex)} data-cy="download-results-button">
          {options[selectedIndex]}
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
