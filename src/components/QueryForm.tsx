import { useState } from 'react';
import { Button, CircularProgress, FormHelperText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sexes } from '../utils/constants';
import {
  NodeOption,
  AttributeOption,
  FieldInput,
  FieldInputOption,
  Pipelines,
  ImagingModalityOption,
  PipelineOption,
} from '../utils/types';
import {
  parseNumericValue,
  normalizeFieldInputOptions,
  validateContinuousValue,
} from '../utils/utils';
import SingleSelectField from './SingleSelectField';
import MultiSelectField from './MultiSelectField';
import PipelineField from './PipelineField';
import ContinuousField from './ContinuousField';
import GetDataDialog from './GetDataDialog';

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
  selectedPipelines,
  pipelines,
  updateCategoricalQueryParams,
  updateContinuousQueryParams,
  onPipelineChange,
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
  selectedPipelines: PipelineOption[];
  pipelines: Pipelines;
  updateCategoricalQueryParams: (label: string, value: FieldInput) => void;
  updateContinuousQueryParams: (label: string, value: string) => void;
  onPipelineChange: (selectedPipelines: PipelineOption[]) => void;
  loading: boolean;
  onSubmitQuery: () => void;
}) {
  const [openDialog, setOpenDialog] = useState(false);

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

  return (
    <div className="flex flex-col gap-2">
      <div>
        <MultiSelectField
          label="Neurobagel graph"
          options={availableNodes.map((n) => ({
            label: n.NodeName,
            id: n.ApiURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          value={normalizeFieldInputOptions(selectedNode)}
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
        <SingleSelectField
          label="Sex"
          options={Object.entries(sexes).map(([key, value]) => ({
            label: key,
            id: value,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          value={sex as FieldInputOption | null}
        />
      </div>
      <div>
        <div>
          <MultiSelectField
            label="Diagnosis"
            options={diagnosisOptions.map((d) => ({
              label: d.Label as string,
              id: d.TermURL,
            }))}
            onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
            value={normalizeFieldInputOptions(diagnosis)}
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
        <MultiSelectField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label as string, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          value={normalizeFieldInputOptions(assessmentTool)}
        />
      </div>
      <div>
        <MultiSelectField
          label="Imaging modality"
          options={imagingModalityOptions.map((value) => ({
            label: value.Label as string,
            id: value.TermURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          value={normalizeFieldInputOptions(imagingModality)}
        />
      </div>
      <div>
        <PipelineField
          pipelines={pipelines}
          value={selectedPipelines}
          onFieldChange={onPipelineChange}
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
