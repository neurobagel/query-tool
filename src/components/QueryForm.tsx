import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  FormHelperText,
  Typography,
  AutocompleteRenderGroupParams,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { sexes } from '../utils/constants';
import {
  NodeOption,
  AttributeOption,
  FieldInput,
  FieldInputOption,
  CategoricalFieldOption,
  Pipelines,
  ImagingModalityOption,
} from '../utils/types';
import { parseNumericValue, normalizeFieldInputOptions } from '../utils/utils';
import CategoricalField from './CategoricalField';
import ContinuousField from './ContinuousField';
import GetDataDialog from './GetDataDialog';

function CollapsiblePipelineGroup({
  params,
  selectedPipelines,
  selectedVersions,
  onTogglePipeline,
}: {
  params: AutocompleteRenderGroupParams;
  selectedPipelines: FieldInputOption[];
  selectedVersions: FieldInputOption[];
  onTogglePipeline: (pId: string, pLabel: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pLabel = params.group;
  const isPipelineInName = selectedPipelines.some((p) => p.label === pLabel);
  const pId = selectedPipelines.find((p) => p.label === pLabel)?.id ?? `np:${pLabel}`;
  const hasSelectedVersion = selectedVersions.some((v) => v.id.startsWith(`${pId}::`));

  const isPipelineChecked = isPipelineInName && !hasSelectedVersion;

  return (
    <li key={params.key}>
      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded((prev) => !prev)}
        elevation={0}
        square
        disableGutters
        sx={{
          backgroundColor: 'transparent',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon fontSize="small" />}
          sx={{
            minHeight: 36,
            maxHeight: 36,
            px: 1,
            py: 0,
            '&.Mui-expanded': { minHeight: 36, maxHeight: 36 },
            '&:hover': { backgroundColor: 'action.hover' },
            '.MuiAccordionSummary-content': {
              my: 0,
              alignItems: 'center',
              '&.Mui-expanded': { my: 0 },
            },
          }}
        >
          <Checkbox
            data-cy={`pipeline-group-${pId}-checkbox`}
            size="small"
            checked={isPipelineChecked}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePipeline(pId, pLabel);
            }}
          />
          <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>
            {pLabel}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <ul>{params.children}</ul>
        </AccordionDetails>
      </Accordion>
    </li>
  );
}

function QueryForm({
  availableNodes,
  diagnosisOptions,
  assessmentOptions,
  imagingModalityOptions,
  selectedNode,
  minAge,
  maxAge,
  sex,
  diagnosis,
  minNumImagingSessions,
  minNumPhenotypicSessions,
  assessmentTool,
  imagingModality,
  pipelineVersion,
  pipelineName,
  pipelines,
  updateCategoricalQueryParams,
  updateContinuousQueryParams,
  loading,
  onSubmitQuery,
}: {
  availableNodes: NodeOption[];
  diagnosisOptions: AttributeOption[];
  assessmentOptions: AttributeOption[];
  imagingModalityOptions: ImagingModalityOption[];
  selectedNode: FieldInput;
  minAge: string;
  maxAge: string;
  sex: FieldInput;
  diagnosis: FieldInput;
  minNumImagingSessions: string;
  minNumPhenotypicSessions: string;
  assessmentTool: FieldInput;
  imagingModality: FieldInput;
  pipelineVersion: FieldInput;
  pipelineName: FieldInput;
  pipelines: Pipelines;
  updateCategoricalQueryParams: (label: string, value: FieldInput) => void;
  updateContinuousQueryParams: (label: string, value: string) => void;
  loading: boolean;
  onSubmitQuery: () => void;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  function validateContinuousValue(rawValue: string, parsedValue: number | null) {
    const trimmed = rawValue.trim();
    if (trimmed === '') {
      // Value is default, user has not entered anything yet
      return '';
    }
    if (parsedValue === null) {
      return 'Please enter a valid number!';
    }
    if (parsedValue < 0) {
      return 'Please enter a positive number!';
    }
    return '';
  }

  const parsedMinAge = parseNumericValue(minAge);
  const parsedMaxAge = parseNumericValue(maxAge);
  const parsedMinNumImagingSessions = parseNumericValue(minNumImagingSessions);
  const parsedMinNumPhenotypicSessions = parseNumericValue(minNumPhenotypicSessions);

  const minAgeHelperText: string = validateContinuousValue(minAge, parsedMinAge);
  const maxAgeHelperText: string = validateContinuousValue(maxAge, parsedMaxAge);
  const minNumImagingSessionsHelperText: string = validateContinuousValue(
    minNumImagingSessions,
    parsedMinNumImagingSessions
  );
  const minNumPhenotypicSessionsHelperText: string = validateContinuousValue(
    minNumPhenotypicSessions,
    parsedMinNumPhenotypicSessions
  );

  const minAgeExceedsMaxAge: boolean =
    parsedMinAge !== null && parsedMaxAge !== null && parsedMinAge > parsedMaxAge;
  const disableSubmit: boolean =
    minAgeExceedsMaxAge ||
    minAgeHelperText !== '' ||
    maxAgeHelperText !== '' ||
    minNumImagingSessionsHelperText !== '';

  const pipelineCombinedOptions: CategoricalFieldOption[] = Object.keys(pipelines).flatMap(
    (pId) => {
      const pLabel = pId.startsWith('np:') ? pId.slice(3) : pId;
      const versions = pipelines[pId] ?? [];

      if (versions.length === 0) {
        return [
          {
            label: `${pLabel} any version`,
            id: pId,
            group: pLabel,
          },
        ];
      }

      return versions.map((v) => ({
        label: `${pLabel} ${v}`,
        id: `${pId}::${v}`,
        group: pLabel,
      }));
    }
  );

  const selectedPipelines = normalizeFieldInputOptions(pipelineName);
  const selectedVersionsAll = normalizeFieldInputOptions(pipelineVersion);

  const combinedInputValue: CategoricalFieldOption[] = selectedPipelines.flatMap((p) => {
    const pVersions = selectedVersionsAll.filter((v) => v.id.startsWith(`${p.id}::`));
    if (pVersions.length > 0) {
      return pVersions.map((v) => ({
        label: v.label,
        id: v.id,
        group: p.label,
      }));
    }
    return [
      {
        label: `${p.label} any version`,
        id: p.id,
        group: p.label,
      },
    ];
  });

  const handleTogglePipeline = (pId: string, pLabel: string) => {
    const hasSelectedVersion = selectedVersionsAll.some((v) => v.id.startsWith(`${pId}::`));
    const isPipelineInName = selectedPipelines.some((p) => p.id === pId);
    const isHeaderChecked = isPipelineInName && !hasSelectedVersion;

    let updatedPipelines: FieldInputOption[];
    let updatedVersions: FieldInputOption[];

    if (isHeaderChecked) {
      updatedPipelines = selectedPipelines.filter((p) => p.id !== pId);
      updatedVersions = selectedVersionsAll.filter((v) => !v.id.startsWith(`${pId}::`));
    } else {
      const exists = selectedPipelines.some((p) => p.id === pId);
      updatedPipelines = exists
        ? selectedPipelines
        : [...selectedPipelines, { id: pId, label: pLabel }];
      updatedVersions = selectedVersionsAll.filter((v) => !v.id.startsWith(`${pId}::`));
    }

    updateCategoricalQueryParams(
      'Pipeline name',
      updatedPipelines.length > 0 ? updatedPipelines : null
    );
    updateCategoricalQueryParams(
      'Pipeline version',
      updatedVersions.length > 0 ? updatedVersions : null
    );
  };

  const handleCombinedPipelineChange = (selectedOptionsInput: FieldInput) => {
    const selectedOptions = normalizeFieldInputOptions(selectedOptionsInput);

    if (selectedOptions.length === 0) {
      updateCategoricalQueryParams('Pipeline name', null);
      updateCategoricalQueryParams('Pipeline version', null);
      return;
    }

    const updatedPipelinesMap = new Map<string, FieldInputOption>();
    const updatedVersions: FieldInputOption[] = [];

    (selectedOptions as CategoricalFieldOption[]).forEach((opt) => {
      if (opt.id.includes('::')) {
        const pId = opt.id.split('::')[0];
        const pLabel = opt.group ?? (pId.startsWith('np:') ? pId.slice(3) : pId);
        updatedPipelinesMap.set(pId, { id: pId, label: pLabel });
        updatedVersions.push({ id: opt.id, label: opt.label });
      } else {
        const pId = opt.id;
        const pLabel = opt.group ?? (pId.startsWith('np:') ? pId.slice(3) : pId);
        updatedPipelinesMap.set(pId, { id: pId, label: pLabel });
      }
    });

    const updatedPipelines = Array.from(updatedPipelinesMap.values());

    updateCategoricalQueryParams(
      'Pipeline name',
      updatedPipelines.length > 0 ? updatedPipelines : null
    );
    updateCategoricalQueryParams(
      'Pipeline version',
      updatedVersions.length > 0 ? updatedVersions : null
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <CategoricalField
          label="Neurobagel graph"
          options={availableNodes.map((n) => ({
            label: n.NodeName,
            id: n.ApiURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          multiple
          inputValue={selectedNode}
        />
      </div>
      <div>
        <ContinuousField
          errorText={minAgeExceedsMaxAge ? '' : minAgeHelperText}
          label="Minimum age"
          value={minAge}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <ContinuousField
          errorText={minAgeExceedsMaxAge ? '' : maxAgeHelperText}
          label="Maximum age"
          value={maxAge}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      {minAgeExceedsMaxAge && (
        <div>
          <FormHelperText error>
            Value of maximum age must be greater than or equal to value of minimum age
          </FormHelperText>
        </div>
      )}
      <div>
        <CategoricalField
          label="Sex"
          options={Object.entries(sexes).map(([key, value]) => ({
            label: key,
            id: value,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={sex}
        />
      </div>
      <div>
        <div>
          <CategoricalField
            label="Diagnosis"
            options={diagnosisOptions.map((d) => ({
              label: d.Label as string,
              id: d.TermURL,
            }))}
            onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
            multiple
            inputValue={diagnosis}
          />
        </div>
      </div>
      <div>
        <ContinuousField
          errorText={minNumImagingSessionsHelperText}
          label="Minimum number of imaging sessions"
          value={minNumImagingSessions}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <ContinuousField
          errorText={minNumPhenotypicSessionsHelperText}
          label="Minimum number of phenotypic sessions"
          value={minNumPhenotypicSessions}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label as string, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          multiple
          inputValue={assessmentTool}
        />
      </div>
      <div>
        <CategoricalField
          label="Imaging modality"
          options={imagingModalityOptions.map((value) => ({
            label: value.Label as string,
            id: value.TermURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          multiple
          inputValue={imagingModality}
        />
      </div>
      <div>
        <CategoricalField
          label="Pipeline name and version"
          options={pipelineCombinedOptions}
          onFieldChange={(_, value) => handleCombinedPipelineChange(value)}
          multiple
          inputValue={combinedInputValue}
          renderGroup={(params) => (
            <CollapsiblePipelineGroup
              params={params}
              selectedPipelines={selectedPipelines}
              selectedVersions={selectedVersionsAll}
              onTogglePipeline={handleTogglePipeline}
            />
          )}
        />
      </div>

      <div className="flex justify-between">
        <Button
          data-cy="submit-query-button"
          disabled={disableSubmit}
          variant="contained"
          endIcon={
            loading ? (
              <CircularProgress size="20px" thickness={5.5} className="text-white" />
            ) : (
              <SendIcon />
            )
          }
          // TODO: figure out why eslint is complain when we pass
          // a function directly as opposed to using a anonymous function
          onClick={() => onSubmitQuery()}
        >
          Submit Query
        </Button>
        <Button
          variant="contained"
          data-cy="how-to-get-data-dialog-button"
          onClick={() => setOpenDialog(true)}
        >
          How to access data
        </Button>
        <GetDataDialog open={openDialog} onClose={() => setOpenDialog(false)} />
      </div>
    </div>
  );
}

export default QueryForm;
