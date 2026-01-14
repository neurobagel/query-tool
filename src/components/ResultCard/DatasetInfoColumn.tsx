import { Checkbox, Stack, Tooltip, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTypeIcons from './AccessTypeIcons';

interface DatasetInfoColumnProps {
  datasetUuid: string;
  checked: boolean;
  onCheckboxChange: (id: string) => void;
  datasetName: string;
  authors: string[];
  homepage: string | null;
  repositoryUrl: string | null;
  accessType: 'public' | 'registered' | 'restricted' | null;
}

function DatasetInfoColumn({
  datasetUuid,
  checked,
  onCheckboxChange,
  datasetName,
  authors,
  homepage,
  repositoryUrl,
  accessType,
}: DatasetInfoColumnProps) {
  return (
    <>
      <Checkbox
        data-cy={`card-${datasetUuid}-checkbox`}
        checked={checked}
        onChange={() => onCheckboxChange(datasetUuid)}
        sx={{ p: 0.5, alignSelf: 'flex-start' }}
      />
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        {/* Dataset Name (Text Only) */}
        <Tooltip title={datasetName} placement="top">
          <Typography
            variant="h6"
            component="div"
            sx={{
              lineHeight: 1.2,
            }}
          >
            {datasetName.length > 39 ? `${datasetName.substring(0, 39)}...` : datasetName}
          </Typography>
        </Tooltip>

        {/* Authors (First 3) */}
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {authors.length > 0
            ? authors.slice(0, 3).join(', ') + (authors.length > 3 ? ' et al.' : '')
            : 'No authors listed'}
        </Typography>

        {/* Dataset Icons */}
        <div className="mt-1 flex items-center gap-1">
          <Tooltip title={homepage ? 'Homepage' : 'No Homepage available'} placement="top">
            <span>
              {homepage ? (
                <IconButton
                  data-cy={`card-${datasetUuid}-homepage-icon`}
                  size="small"
                  color="primary"
                  style={{ padding: 4 }}
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HomeIcon fontSize="medium" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  disabled
                  color="primary"
                  style={{ padding: 4 }}
                  data-cy={`card-${datasetUuid}-homepage-icon`}
                >
                  <HomeIcon fontSize="medium" />
                </IconButton>
              )}
            </span>
          </Tooltip>

          <Tooltip
            title={repositoryUrl ? 'Raw Data Available' : 'No Raw Data Available'}
            placement="top"
          >
            <DownloadIcon
              color={repositoryUrl ? 'action' : 'disabled'}
              fontSize="small"
              data-cy={`card-${datasetUuid}-download-icon`}
            />
          </Tooltip>

          <AccessTypeIcons accessType={accessType} datasetUuid={datasetUuid} />
        </div>
      </Stack>
    </>
  );
}

export default DatasetInfoColumn;
