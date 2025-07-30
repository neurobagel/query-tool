import React, { useState } from 'react';
import { IconButton, Popover, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NBTheme from '../theme';

interface CodeBlockProps {
  code?: string;
}

function CodeBlock({ code = 'Sample code content' }: CodeBlockProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  const handleCopyClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await navigator.clipboard.writeText(code);
    setAnchorEl(event.currentTarget);
    setShowPopover(true);

    setTimeout(() => {
      setShowPopover(false);
    }, 2000);
  };

  const handleClose = () => {
    setShowPopover(false);
    setAnchorEl(null);
  };

  return (
    <div className="relative overflow-hidden rounded bg-gray-200 text-sm">
      <pre
        data-cy="error-container"
        className="overflow-auto whitespace-pre-wrap break-words px-2 py-1 pr-12 text-black"
        style={{ maxHeight: '10vh', width: '100%', boxSizing: 'border-box', margin: 0 }}
      >
        {code}
      </pre>
      <IconButton
        color="primary"
        onClick={handleCopyClick}
        className="absolute right-4 top-2"
        size="small"
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      <Popover
        open={showPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography
          className="rounded px-2 py-1 text-sm text-white shadow"
          sx={{ backgroundColor: NBTheme.palette.primary.main }}
        >
          Copied!
        </Typography>
      </Popover>
    </div>
  );
}

CodeBlock.defaultProps = {
  code: 'Sample code content',
};

export default CodeBlock;
