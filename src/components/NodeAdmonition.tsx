import React from 'react';
import { Alert, Grow } from '@mui/material';

export type NodeAdmonitionProps = {
  nodes: string[];
  onDismiss: (nodeName: string) => void;
};

type AdmonitionConfig = {
  text: React.ReactNode;
  severity?: 'info' | 'warning' | 'error' | 'success';
  dataCy?: string;
};

const ADMONITION_CONFIGS: { [nodeName: string]: AdmonitionConfig } = {
  OpenNeuro: {
    severity: 'info',
    dataCy: 'openneuro-alert',
    text: (
      <>
        The OpenNeuro node is being actively annotated at the participant level and does not include
        all datasets yet. Check back soon to find more data. If you would like to contribute
        annotations for existing OpenNeuro datasets, please head over to&nbsp;
        <a href="https://upload-ui.neurobagel.org/" target="_blank" rel="noreferrer">
          Neurobagel&apos;s OpenNeuro utility service
        </a>
        &nbsp;which is designed to download and upload OpenNeuro datasets within Neurobagel
        ecosystem.
      </>
    ),
  },
  EBRAINS: {
    severity: 'info',
    dataCy: 'ebrains-alert',
    text: (
      <>
        The EBRAINS node is being actively annotated and does not include all datasets yet. Check
        back soon to find more data.
      </>
    ),
  },
};

function NodeAdmonition({ nodes, onDismiss }: NodeAdmonitionProps) {
  return (
    <>
      {nodes.map((nodeName) => {
        const config = ADMONITION_CONFIGS[nodeName];
        if (!config) return null;

        return (
          <React.Fragment key={nodeName}>
            <Grow in mountOnEnter unmountOnExit>
              <Alert
                data-cy={config.dataCy}
                severity={config.severity || 'info'}
                onClose={() => {
                  onDismiss(nodeName);
                }}
              >
                {config.text}
              </Alert>
            </Grow>
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default NodeAdmonition;
