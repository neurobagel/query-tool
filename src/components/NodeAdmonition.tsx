import React, { useEffect, useState } from 'react';
import { Alert, Grow } from '@mui/material';

export type NodeAdmonitionProps = {
  text: React.ReactNode;
  show?: boolean;
  onClose?: () => void;
  dataCy?: string;
};

function NodeAdmonition({ text, show = true, onClose, dataCy }: NodeAdmonitionProps) {
  const [open, setOpen] = useState<boolean>(Boolean(show));

  // If parent toggles show from false -> true, reopen the admonition
  useEffect(() => {
    if (show) setOpen(true);
  }, [show]);

  if (!show) return null;

  return (
    <>
      <Grow in={open} mountOnEnter unmountOnExit>
        <Alert
          data-cy={dataCy}
          severity="info"
          onClose={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          {text}
        </Alert>
      </Grow>
      {open ? <br /> : null}
    </>
  );
}

export default NodeAdmonition;
