import { useState } from 'react';
import { Button, CircularProgress, FormHelperText, Tooltip, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sexes, modalities } from '../utils/constants';
import {
  NodeOption,
  AttributeOption,
  FieldInputOption,
  FieldInput,
  Pipelines,
} from '../utils/types';
import CategoricalField from './CategoricalField';
import ContinuousField from './ContinuousField';
import GetDataDialog from './GetDataDialog';

function QueryForm({
  availableNodes,
  diagnosisOptions,
  assessmentOptions,
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

  function parseNumericValue(value: string): number | null {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return null;
    }

    const parsed = Number(trimmedValue);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }

  function validateContinuousValue(value: number | null) {
    if (value === null) {
      // Value is default, user has not entered anything yet
      return '';
    }
    if (Number.isNaN(value)) {
      return 'Please enter a valid number!';
    }
    if (value < 0) {
      return 'Please enter a positive number!';
    }
    return '';
  }

  const parsedMinAge = parseNumericValue(minAge);
  const parsedMaxAge = parseNumericValue(maxAge);
  const parsedMinNumImagingSessions = parseNumericValue(minNumImagingSessions);
  const parsedMinNumPhenotypicSessions = parseNumericValue(minNumPhenotypicSessions);

  const minAgeHelperText: string = validateContinuousValue(parsedMinAge);
  const maxAgeHelperText: string = validateContinuousValue(parsedMaxAge);
  const minNumImagingSessionsHelperText: string = validateContinuousValue(
    parsedMinNumImagingSessions
  );
  const minNumPhenotypicSessionsHelperText: string = validateContinuousValue(
    parsedMinNumPhenotypicSessions
  );

  const minAgeExceedsMaxAge: boolean =
    parsedMinAge !== null &&
    parsedMaxAge !== null &&
    !Number.isNaN(parsedMinAge) &&
    !Number.isNaN(parsedMaxAge) &&
    parsedMinAge > parsedMaxAge;
  const disableSubmit: boolean =
    minAgeExceedsMaxAge ||
    minAgeHelperText !== '' ||
    maxAgeHelperText !== '' ||
    minNumImagingSessionsHelperText !== '';

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
          helperText={minAgeExceedsMaxAge ? '' : minAgeHelperText}
          label="Minimum age"
          value={minAge}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <ContinuousField
          helperText={minAgeExceedsMaxAge ? '' : maxAgeHelperText}
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
              label: d.Label,
              id: d.TermURL,
            }))}
            onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
            inputValue={diagnosis}
          />
        </div>
      </div>
      <div>
        <ContinuousField
          helperText={minNumImagingSessionsHelperText}
          label="Minimum number of imaging sessions"
          value={minNumImagingSessions}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <ContinuousField
          helperText={minNumPhenotypicSessionsHelperText}
          label="Minimum number of phenotypic sessions"
          value={minNumPhenotypicSessions}
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={assessmentTool}
        />
      </div>
      <div>
        <CategoricalField
          label="Imaging modality"
          options={Object.entries(modalities).map(([, value]) => ({
            label: value.label,
            id: value.TermURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={imagingModality}
        />
      </div>
      <div>
        <CategoricalField
          label="Pipeline name"
          options={Object.keys(pipelines).map((pipelineURI) => ({
            // Remove the `np:` prefix
            label: pipelineURI.slice(3),
            id: pipelineURI,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={pipelineName}
        />
      </div>
      {pipelineName === null ? (
        <Tooltip
          title={<Typography variant="body1">Please select a pipeline name</Typography>}
          placement="right"
        >
          <div>
            <CategoricalField
              label="Pipeline version"
              options={[]}
              onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
              inputValue={null}
              disabled
            />
          </div>
        </Tooltip>
      ) : (
        <div>
          <CategoricalField
            label="Pipeline version"
            options={Object.values(pipelines[(pipelineName as FieldInputOption).id]).map((v) => ({
              label: v,
              id: v,
            }))}
            onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
            inputValue={pipelineVersion}
          />
        </div>
      )}

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
