import { Tooltip, Button, Stack, Divider } from '@mui/material';

interface DerivativeDataColumnProps {
  availablePipelines: Record<string, string[]>;
  datasetUuid: string;
}

function DerivativeDataColumn({ availablePipelines, datasetUuid }: DerivativeDataColumnProps) {
  return Object.entries(availablePipelines).length > 0 ? (
    <Stack
      direction="row"
      data-cy={`card-${datasetUuid}-available-pipelines-group`}
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: '#ffffff', borderRightWidth: 2 }}
        />
      }
      sx={{
        boxShadow: 'none',
        borderRadius: 1,
        overflow: 'hidden',
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
                borderRadius: 0,
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
    </Stack>
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
