import { Tooltip } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';

interface NodeModeIconProps {
  recordsProtected: boolean;
}

function NodeModeIcon({ recordsProtected }: NodeModeIconProps) {
  const Icon = recordsProtected ? ShieldIcon : PublicIcon;
  const title = recordsProtected ? 'Node Mode: Counts' : 'Node Mode: Records';

  return (
    <Tooltip title={title} placement="top">
      <Icon fontSize="small" />
    </Tooltip>
  );
}

export default NodeModeIcon;
