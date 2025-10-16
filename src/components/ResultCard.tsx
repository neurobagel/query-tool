import { memo } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Tooltip, Divider } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { modalities } from '../utils/constants';

const ResultCard = memo(
  ({
    nodeName,
    datasetUUID,
    datasetName,
    datasetPortalURI,
    datasetTotalSubjects,
    numMatchingSubjects,
    imageModals,
    pipelines,
    checked,
    onCheckboxChange,
  }: {
    nodeName: string;
    datasetName: string;
    datasetUUID: string;
    datasetPortalURI: string;
    datasetTotalSubjects: number;
    numMatchingSubjects: number;
    imageModals: string[];
    pipelines: {
      [key: string]: string[];
    };
    checked: boolean;
    onCheckboxChange: (id: string) => void;
  }) => (
    <Card data-cy={`card-${datasetUUID}`}>
      <CardContent>
        <div className="grid grid-cols-3 items-center">
          <div className="flex flex-row items-center">
            <div>
              <Checkbox
                data-cy={`card-${datasetUUID}-checkbox`}
                checked={checked}
                onChange={() => onCheckboxChange(datasetUUID)}
              />
            </div>
            <div>
              {datasetPortalURI ? (
                <a
                  href={datasetPortalURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                    }}
                  >
                    {datasetName}
                  </Typography>
                  <OpenInNewIcon
                    fontSize="medium"
                    sx={{
                      color: 'primary.main',
                    }}
                  />
                </a>
              ) : (
                <Typography variant="h5">{datasetName}</Typography>
              )}

              <Typography variant="subtitle1">from {nodeName}</Typography>
              <Typography variant="subtitle2">
                {numMatchingSubjects} subjects match / {datasetTotalSubjects} total subjects
              </Typography>
            </div>
          </div>
          <div className="justify-self-center">
            {Object.entries(pipelines).length === 0 ? (
              <Button
                data-cy={`card-${datasetUUID}-available-pipelines-button`}
                variant="contained"
                disabled
                className="shadow-none hover:shadow-none"
                sx={{ textTransform: 'none' }}
              >
                No pipelines
              </Button>
            ) : (
              <Tooltip
                data-cy={`card-${datasetUUID}-available-pipelines-tooltip`}
                title={
                  <Typography variant="body1">
                    {Object.entries(pipelines)
                      .flatMap(([name, versions]) =>
                        versions.map((version) => `${name.split('/').slice(-1)[0]} ${version}`)
                      )
                      .map((pipeline) => (
                        <Divider>{pipeline}</Divider>
                      ))}
                  </Typography>
                }
                placement="top"
              >
                <Button
                  data-cy={`card-${datasetUUID}-available-pipelines-button`}
                  variant="contained"
                  className="shadow-none hover:shadow-none"
                  startIcon={<UnfoldMoreIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Available pipelines
                </Button>
              </Tooltip>
            )}
          </div>
          <div className="justify-self-end" data-cy="modality-buttons">
            <ButtonGroup>
              {imageModals
                .sort()
                .filter((modal) => Object.keys(modalities).includes(modal))
                .map((modal) => (
                  <Button
                    key={modal}
                    variant="contained"
                    disableElevation
                    sx={{
                      backgroundColor: modalities[modal].bgColor,
                      '&:hover': {
                        backgroundColor: modalities[modal].bgColor,
                        cursor: 'default',
                      },
                    }}
                  >
                    {modalities[modal].name}
                  </Button>
                ))}
            </ButtonGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

export default ResultCard;
