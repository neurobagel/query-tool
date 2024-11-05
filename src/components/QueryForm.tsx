import {
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  FormHelperText,
  Tooltip,
  Typography,
} from '@mui/material';
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

function QueryForm({
  availableNodes,
  diagnosisOptions,
  assessmentOptions,
  selectedNode,
  minAge,
  maxAge,
  sex,
  diagnosis,
  isControl,
  minNumImagingSessions,
  minNumPhenotypicSessions,
  setIsControl,
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
  minAge: number | null;
  maxAge: number | null;
  sex: FieldInput;
  diagnosis: FieldInput;
  isControl: boolean;
  setIsControl: (value: boolean) => void;
  minNumImagingSessions: number | null;
  minNumPhenotypicSessions: number | null;
  assessmentTool: FieldInput;
  imagingModality: FieldInput;
  pipelineVersion: FieldInput;
  pipelineName: FieldInput;
  pipelines: Pipelines;
  updateCategoricalQueryParams: (label: string, value: FieldInput) => void;
  updateContinuousQueryParams: (label: string, value: number | null) => void;
  loading: boolean;
  onSubmitQuery: () => void;
}) {
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

  const minAgeHelperText: string = validateContinuousValue(minAge);
  const maxAgeHelperText: string = validateContinuousValue(maxAge);
  const minNumImagingSessionsHelperText: string = validateContinuousValue(minNumImagingSessions);
  const minNumPhenotypicSessionsHelperText: string =
    validateContinuousValue(minNumPhenotypicSessions);

  const minAgeExceedsMaxAge: boolean = minAge && maxAge ? minAge > maxAge : false;
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
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <ContinuousField
          helperText={minAgeExceedsMaxAge ? '' : maxAgeHelperText}
          label="Maximum age"
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
        <div className="flex flex-row items-center gap-3">
          <div className="flex-1">
            <CategoricalField
              label="Diagnosis"
              options={diagnosisOptions.map((d) => ({
                label: d.Label,
                id: d.TermURL,
              }))}
              onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
              inputValue={isControl ? null : diagnosis}
              disabled={isControl}
            />
          </div>
          <div className="flex-1">
            <FormControlLabel
              data-cy="healthy-control-checkbox"
              control={<Checkbox name="healthyControl" />}
              label="Healthy Control"
              onChange={() => setIsControl(!isControl)}
            />
          </div>
        </div>
      </div>
      <div>
        <ContinuousField
          helperText={minNumImagingSessionsHelperText}
          label="Minimum number of imaging sessions"
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div>
        <ContinuousField
          helperText={minNumPhenotypicSessionsHelperText}
          label="Minimum number of phenotypic sessions"
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
              inputValue={pipelineVersion}
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

      <div>
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
      </div>
    </div>
  );
}

export default QueryForm;
