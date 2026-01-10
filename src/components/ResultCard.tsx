import { memo, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Tooltip, Divider, Chip, Collapse, Stack, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HomeIcon from '@mui/icons-material/Home';
import ShieldIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import { ImagingModalitiesMetadata } from '../utils/types';
import { modalitiesDataTypeColorMapping } from '../utils/constants';

const ResultCard = memo(
  ({
    nodeName,
    datasetUuid,
    datasetName,
    authors,
    homepage,
    referencesAndLinks,
    keywords,
    repositoryUrl,
    accessInstructions,
    accessType,
    accessEmail,
    accessLink,
    datasetTotalSubjects,
    recordsProtected,
    numMatchingSubjects,
    imageModals,
    availablePipelines,
    imagingModalitiesMetadata,
    checked,
    onCheckboxChange,
  }: {
    nodeName: string;
    datasetUuid: string;
    datasetName: string;
    authors: string[];
    homepage: string | null;
    referencesAndLinks: string[];
    keywords: string[];
    repositoryUrl: string | null;
    accessInstructions: string | null;
    accessType: 'public' | 'registered' | 'restricted' | null;
    accessEmail: string | null;
    accessLink: string | null;
    datasetTotalSubjects: number;
    recordsProtected: boolean;
    numMatchingSubjects: number;
    imageModals: string[];
    availablePipelines: Record<string, string[]>;
    imagingModalitiesMetadata: ImagingModalitiesMetadata;
    checked: boolean;
    onCheckboxChange: (id: string) => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Helper to render access icon group
    const renderAccessTypeIcon = () => {
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
    };

    const renderNodeModeIcon = () => {
      const isProtected = recordsProtected;
      const Icon = isProtected ? ShieldIcon : PublicIcon;
      const title = isProtected ? 'Node Mode: Counts' : 'Node Mode: Records';

      return (
        <Tooltip title={title} placement="top">
          <Icon fontSize="small" />
        </Tooltip>
      );
    };

    const renderRepoButton = () => {
      if (!repositoryUrl) {
        return (
          <Button
            data-cy={`card-${datasetUuid}-repository-button`}
            variant="outlined"
            disableElevation
            size="small"
            disabled
            sx={{ textTransform: 'none' }}
            endIcon={<OpenInNewIcon />}
          >
            Repository
          </Button>
        );
      }
      return (
        <Button
          data-cy={`card-${datasetUuid}-repository-button`}
          variant="outlined"
          disableElevation
          size="small"
          href={repositoryUrl}
          target="_blank"
          sx={{ textTransform: 'none' }}
          endIcon={<OpenInNewIcon />}
        >
          Repository
        </Button>
      );
    };

    return (
      <Card data-cy={`card-${datasetUuid}`} sx={{ mb: 2 }}>
        {/* HEADER: Node Name + Node Mode Icon */}
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
          {renderNodeModeIcon()}
        </Box>

        <CardContent>
          {/* DATASET INFO GRID */}
          <div className="grid grid-cols-12 gap-4">
            {/* COL 1: Checkbox + Dataset Name + Authors + Dataset Icons */}
            <div className="col-span-5 flex gap-2">
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

                  {renderAccessTypeIcon()}
                </div>
              </Stack>
            </div>

            {/* COL 2: Subjects */}
            <div className="col-span-3 flex flex-col justify-center">
              <Typography variant="body2" fontWeight="bold">
                Matching subjects:
              </Typography>
              <Typography variant="h6">
                {numMatchingSubjects} / {datasetTotalSubjects}
              </Typography>
            </div>

            {/* COL 3: Imaging Modalities */}
            <div className="col-span-2 flex flex-wrap content-center justify-center gap-1">
              {imageModals.length > 0 ? (
                <Tooltip title="Imaging Modalities" placement="top">
                  <ButtonGroup
                    data-cy="modality-buttons"
                    sx={{
                      boxShadow: 'none',
                      '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                        borderRight: '2px solid #ffffff !important',
                      },
                    }}
                  >
                    {imageModals
                      .sort()
                      .filter((modal) => {
                        const metadata = imagingModalitiesMetadata[modal];
                        return Boolean(metadata?.DataType && metadata?.Abbreviation);
                      })
                      .map((modal) => {
                        const metadata = imagingModalitiesMetadata[modal]!;
                        const dataType = metadata.DataType;
                        const backgroundColor =
                          dataType && modalitiesDataTypeColorMapping[dataType.toLowerCase()];

                        return (
                          <Button
                            key={modal}
                            data-cy={`card-${datasetUuid}-${metadata.Abbreviation}-imaging-modality-button`}
                            variant="contained"
                            disableElevation
                            sx={{
                              backgroundColor: backgroundColor
                                ? `${backgroundColor} !important`
                                : undefined,
                              '&:hover': {
                                backgroundColor: backgroundColor
                                  ? `${backgroundColor} !important`
                                  : undefined,
                                cursor: 'default',
                              },
                              padding: '2px 8px',
                              minWidth: 'auto',
                            }}
                          >
                            {metadata.Abbreviation ?? metadata.Label ?? modal}
                          </Button>
                        );
                      })}
                  </ButtonGroup>
                </Tooltip>
              ) : (
                <Button
                  disabled
                  sx={{ textTransform: 'none', fontStyle: 'italic' }}
                  disableElevation
                >
                  No imaging modalities available
                </Button>
              )}
            </div>

            {/* COL 4: Derivative Data */}
            <div className="col-span-2 flex flex-col items-end justify-center">
              {Object.entries(availablePipelines).length > 0 ? (
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
                      <Tooltip
                        key={name}
                        title={`Pipeline Versions: ${versions.join(', ')}`}
                        placement="top"
                      >
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
              )}
            </div>
          </div>

          {/* EXPANDABLE DETAILS SECTION */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              {/* Keywords */}
              <Box data-cy={`card-${datasetUuid}-keywords`}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Keywords
                </Typography>
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k) => (
                      <Chip key={k} label={k} size="small" />
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" color="text.disabled" fontStyle="italic">
                    No keywords available
                  </Typography>
                )}
              </Box>

              {/* Full Authors */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Authors
                </Typography>
                {authors.length > 0 ? (
                  <Typography variant="body2">{authors.join(', ')}</Typography>
                ) : (
                  <Typography variant="body2" color="text.disabled" fontStyle="italic">
                    No authors listed
                  </Typography>
                )}
              </Box>

              {/* Access Instructions */}
              <Box data-cy={`card-${datasetUuid}-access`}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Access
                </Typography>
                {(() => {
                  const showButtons = Boolean(accessLink || accessEmail || repositoryUrl);
                  return accessInstructions ? (
                    <Typography variant="body2" sx={{ mb: showButtons ? 1 : 0 }}>
                      {accessInstructions}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      fontStyle="italic"
                      sx={{ mb: showButtons ? 1 : 0 }}
                    >
                      No access instructions
                    </Typography>
                  );
                })()}

                <div className="flex gap-2">
                  {accessLink ? (
                    <Button
                      data-cy={`card-${datasetUuid}-access-data-button`}
                      variant="outlined"
                      disableElevation
                      size="small"
                      href={accessLink}
                      target="_blank"
                      endIcon={<OpenInNewIcon />}
                    >
                      Access Data
                    </Button>
                  ) : (
                    <Button
                      data-cy={`card-${datasetUuid}-access-data-button`}
                      variant="outlined"
                      disableElevation
                      size="small"
                      disabled
                      endIcon={<OpenInNewIcon />}
                    >
                      Access Data
                    </Button>
                  )}
                  {accessEmail ? (
                    <Button
                      data-cy={`card-${datasetUuid}-access-contact-button`}
                      variant="outlined"
                      size="small"
                      href={`mailto:${accessEmail}`}
                      endIcon={<OpenInNewIcon />}
                    >
                      Contact
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      endIcon={<OpenInNewIcon />}
                      data-cy={`card-${datasetUuid}-access-contact-button`}
                    >
                      Contact
                    </Button>
                  )}
                  {renderRepoButton()}
                </div>
              </Box>
              {/* References */}
              <Box data-cy={`card-${datasetUuid}-references`}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  References
                </Typography>
                {referencesAndLinks.length > 0 ? (
                  <Stack spacing={0.5}>
                    {referencesAndLinks.map((link) => (
                      <Typography key={link} variant="body2" sx={{ wordBreak: 'break-all' }}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.disabled" fontStyle="italic">
                    No references available
                  </Typography>
                )}
              </Box>
            </Stack>
          </Collapse>

          {/* EXPAND/COLLAPSE BUTTON */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              data-cy={`card-${datasetUuid}-expand-button`}
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ textTransform: 'none' }}
              color="primary"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

export default ResultCard;
