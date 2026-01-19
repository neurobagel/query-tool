import { memo, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Collapse, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ImagingModalitiesMetadata, DatasetsResult } from '../../utils/types';
import ResultCardHeader from './ResultCardHeader';
import DatasetInfoColumn from './DatasetInfoColumn';
import SubjectCountColumn from './SubjectCountColumn';
import ImagingModalitiesColumn from './ImagingModalitiesColumn';
import DerivativeDataColumn from './DerivativeDataColumn';
import ExpandedDetails from './ExpandedDetails';

const ResultCard = memo(
  ({
    dataset,
    imagingModalitiesMetadata,
    checked,
    onCheckboxChange,
  }: {
    dataset: DatasetsResult;
    imagingModalitiesMetadata: ImagingModalitiesMetadata;
    checked: boolean;
    onCheckboxChange: (id: string) => void;
  }) => {
    const {
      node_name: nodeName,
      dataset_uuid: datasetUuid,
      dataset_name: datasetName,
      authors,
      homepage,
      references_and_links: referencesAndLinks,
      keywords,
      repository_url: repositoryUrl,
      access_instructions: accessInstructions,
      access_type: accessType,
      access_email: accessEmail,
      access_link: accessLink,
      dataset_total_subjects: datasetTotalSubjects,
      records_protected: recordsProtected,
      num_matching_subjects: numMatchingSubjects,
      image_modals: imageModals,
      available_pipelines: availablePipelines,
    } = dataset;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <Card data-cy={`card-${datasetUuid}`} sx={{ mb: 2 }}>
        <ResultCardHeader nodeName={nodeName} recordsProtected={recordsProtected} />

        <CardContent>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 flex gap-2">
              <DatasetInfoColumn
                datasetUuid={datasetUuid}
                checked={checked}
                onCheckboxChange={onCheckboxChange}
                datasetName={datasetName}
                authors={authors}
                homepage={homepage}
                repositoryUrl={repositoryUrl}
                accessType={accessType}
              />
            </div>

            <div
              className="col-span-7 flex items-center justify-between gap-4"
              data-cy="result-card-flex-container"
            >
              <div className="flex flex-col items-start text-left">
                <SubjectCountColumn
                  numMatchingSubjects={numMatchingSubjects}
                  datasetTotalSubjects={datasetTotalSubjects}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <ImagingModalitiesColumn
                  imageModals={imageModals}
                  imagingModalitiesMetadata={imagingModalitiesMetadata}
                  datasetUuid={datasetUuid}
                />
                <DerivativeDataColumn
                  availablePipelines={availablePipelines}
                  datasetUuid={datasetUuid}
                />
              </div>
            </div>
          </div>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <ExpandedDetails
              datasetUuid={datasetUuid}
              keywords={keywords}
              authors={authors}
              accessInstructions={accessInstructions}
              accessLink={accessLink}
              accessEmail={accessEmail}
              repositoryUrl={repositoryUrl}
              referencesAndLinks={referencesAndLinks}
            />
          </Collapse>

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
