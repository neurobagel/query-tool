import { Box, Typography } from '@mui/material';
import NodeModeIcon from './NodeModeIcon';

interface ResultCardHeaderProps {
  nodeName: string;
  recordsProtected: boolean;
}

function ResultCardHeader({ nodeName, recordsProtected }: ResultCardHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: 'grey.100',
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" component="span" fontWeight="bold">
        {nodeName} node
      </Typography>
      <NodeModeIcon recordsProtected={recordsProtected} />
    </Box>
  );
}

export default ResultCardHeader;
