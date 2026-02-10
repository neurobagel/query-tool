import { Tooltip, ButtonGroup, Button } from '@mui/material';

interface DerivativeDataColumnProps {
  availablePipelines: Record<string, string[]>;
  datasetUuid: string;
}

function DerivativeDataColumn({ availablePipelines, datasetUuid }: DerivativeDataColumnProps) {
  return Object.entries(availablePipelines).length > 0 ? (
    <ButtonGroup
      data-cy={`card-${datasetUuid}-available-pipelines-group`}
      sx={{
        boxShadow: 'none',
        '& .MuiButtonGroup-grouped:not(:last-of-type)': {
          borderRight: '2px solid #ffffff !important',
        },
      }}
    >
      {Object.entries(availablePipelines).map(([name, versions]) => {
        const shortName = name.split('/').slice(-1)[0];
        return (
          <Tooltip key={name} title={`Pipeline Versions: ${versions.join(', ')}`} placement="top">
            <Button
              data-cy={`card-${datasetUuid}-${shortName}-available-pipelines-button`}
              variant="contained"
              disableElevation
              sx={{
                textTransform: 'none',
                cursor: 'default',
                padding: '2px 8px',
                minWidth: 'auto',
                backgroundColor: '#488fd6ff !important',
                '&:hover': {
                  backgroundColor: '#30739cff !important',
                },
              }}
            >
              {shortName}
            </Button>
          </Tooltip>
        );
      })}
    </ButtonGroup>
  ) : (
    <Button
      disabled
      data-cy={`card-${datasetUuid}-available-pipelines-button`}
      sx={{ textTransform: 'none', fontStyle: 'italic' }}
      disableElevation
    >
      No derivative data available
    </Button>
  );
}

export default DerivativeDataColumn;
