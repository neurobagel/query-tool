import React, { useState } from 'react';
import { IconButton, Popover, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NBTheme from '../theme';
interface CodeBlockProps {
  code?: string;
}

function CodeBlock({ code = 'Sample code content' }: CodeBlockProps) {
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(code);
    setShowPopover(true);

    setTimeout(() => {
      setShowPopover(false);
    }, 2000);
  };

  const handleClose = () => {
    setShowPopover(false);
  };

  return (
    <div
      className="relative rounded bg-gray-200 text-sm"
      style={{ display: 'inline-block', minWidth: '100%' }}
    >
      <pre
        data-cy="error-container"
        className="overflow-auto whitespace-pre-wrap break-words px-2 py-1 pr-12 text-black"
        sx={{ maxHeight: '10vh', width: '100%', boxSizing: 'border-box', margin: 0 }}
      >
        {code}
      </pre>
      <IconButton
        ref={buttonRef}
        color="primary"
        onClick={handleCopyClick}
        size="small"
        sx={{
          position: 'absolute',
          top: 0,
          right: 16,
        }}
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      <Popover open={showPopover} anchorEl={buttonRef.current} onClose={handleClose}>
        <Typography className="rounded px-2 py-1 text-sm text-white shadow" sx={{ backgroundColor: NBTheme.palette.primary.main }}>Copied!</Typography>
      </Popover>
    </div>
  );
}

export default CodeBlock;
