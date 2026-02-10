import { Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';

interface AccessTypeIconsProps {
  accessType: 'public' | 'registered' | 'restricted' | null;
  datasetUuid: string;
}

function AccessTypeIcons({ accessType, datasetUuid }: AccessTypeIconsProps) {
  const accessConfigs = [
    { type: 'public', Icon: LockOpenIcon, label: 'Public', activeColor: 'success' },
    { type: 'registered', Icon: HowToRegIcon, label: 'Registered', activeColor: 'warning' },
    { type: 'restricted', Icon: LockIcon, label: 'Restricted', activeColor: 'error' },
  ] as const;

  const activeConfig = accessConfigs.find((c) => c.type === accessType);
  const groupTooltip = activeConfig
    ? `Access Level: ${activeConfig.label}`
    : 'Access Level: Unknown';

  return (
    <Tooltip title={groupTooltip} placement="top">
      <div
        className="ml-1 flex items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5"
        data-cy={`card-${datasetUuid}-access-type-icon-group`}
      >
        {accessConfigs.map(({ type, Icon, activeColor }) => {
          const isActive = accessType === type;
          const color = isActive ? activeColor : 'disabled';

          return (
            <Icon
              key={type}
              color={color}
              fontSize="small"
              data-cy={`card-${datasetUuid}-${type}-access-type-icon`}
            />
          );
        })}
      </div>
    </Tooltip>
  );
}

export default AccessTypeIcons;
