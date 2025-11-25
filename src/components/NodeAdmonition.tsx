import React, { useState } from 'react';
import { Alert, Tabs, Tab, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type NodeAdmonitionProps = {
  nodes: string[];
  onDismiss: (nodeName: string) => void;
};

type AdmonitionConfig = {
  text: React.ReactNode;
  dataCy?: string;
};

const ADMONITION_CONFIGS: { [nodeName: string]: AdmonitionConfig } = {
  OpenNeuro: {
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
  const [activeTab, setActiveTab] = useState(0);

  if (nodes.length === 0) return null;

  // If only one node, show as a simple alert
  if (nodes.length === 1) {
    const nodeName = nodes[0];
    const config = ADMONITION_CONFIGS[nodeName];
    if (!config) return null;

    return (
      <>
        <Alert data-cy={config.dataCy} severity="info" onClose={() => onDismiss(nodeName)}>
          {config.text}
        </Alert>
        <br />
      </>
    );
  }

  // Multiple nodes: use tabs
  const validNodes = nodes.filter((nodeName) => ADMONITION_CONFIGS[nodeName]);
  if (validNodes.length === 0) return null;

  const currentNode = validNodes[activeTab];
  const currentConfig = ADMONITION_CONFIGS[currentNode];

  return (
    <div className="mb-4">
      <Alert severity="info" icon={false} className="!pb-2">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            {validNodes.map((nodeName) => (
              <Tab
                key={nodeName}
                label={
                  <div className="flex items-center gap-2">
                    <span>{nodeName}</span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(0);
                        onDismiss(nodeName);
                      }}
                      sx={{ padding: '2px' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                }
                sx={{ textTransform: 'none' }}
              />
            ))}
          </Tabs>
        </Box>
        <div data-cy={currentConfig.dataCy}>{currentConfig.text}</div>
      </Alert>
    </div>
  );
}

export default NodeAdmonition;
