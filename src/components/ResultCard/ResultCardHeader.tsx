import { Box, Typography, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import NodeModeIcon from './NodeModeIcon';

interface ResultCardHeaderProps {
  nodeName: string;
  recordsProtected: boolean;
  isCatalog?: boolean;
}

function ResultCardHeader({ nodeName, recordsProtected, isCatalog }: ResultCardHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: isCatalog ? 'rgba(211, 47, 47, 0.04)' : 'rgba(46, 125, 50, 0.04)',
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
      {isCatalog !== undefined && (
        <Tooltip
          title={isCatalog ? 'Catalog-Level Dataset (No Subject Data)' : 'Subject-Level Dataset'}
          placement="top"
        >
          <div className="ml-1 flex items-center gap-1">
            {isCatalog ? <MenuBookIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
          </div>
        </Tooltip>
      )}
    </Box>
  );
}

export default ResultCardHeader;
