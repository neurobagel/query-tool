import {
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { isFederationAPI, sexes, modalities } from '../utils/constants';
import { NodeOption, AttributeOption, FieldInput } from '../utils/types';
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
    <div
      className={
        isFederationAPI
          ? 'grid grid-cols-2 grid-rows-9 gap-2'
          : 'grid grid-cols-2 grid-rows-10 gap-2'
      }
    >
      {isFederationAPI && (
        <div className="col-span-2">
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
      )}
      <div className={isFederationAPI ? 'row-start-2' : ''}>
        <ContinuousField
          helperText={minAgeExceedsMaxAge ? '' : minAgeHelperText}
          label="Minimum age"
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div className={isFederationAPI ? 'row-start-2' : ''}>
        <ContinuousField
          helperText={minAgeExceedsMaxAge ? '' : maxAgeHelperText}
          label="Maximum age"
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      {minAgeExceedsMaxAge && (
        <div className="col-span-2">
          <FormHelperText error>
            Value of maximum age must be greater than or equal to value of minimum age
          </FormHelperText>
        </div>
      )}
      <div className="col-span-2">
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
      <div className={isFederationAPI ? 'col-span-2 row-start-5' : 'col-span-2 row-start-4'}>
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-9">
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
          <div>
            <FormControlLabel
              data-cy="healthy-control-checkbox"
              control={<Checkbox name="healthyControl" />}
              label="Healthy Control"
              onChange={() => setIsControl(!isControl)}
            />
          </div>
        </div>
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-6' : 'col-span-2 row-start-5'}>
        <ContinuousField
          helperText={minNumImagingSessionsHelperText}
          label="Minimum number of imaging sessions"
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-7' : 'col-span-2 row-start-6'}>
        <ContinuousField
          helperText={minNumPhenotypicSessionsHelperText}
          label="Minimum number of phenotypic sessions"
          onFieldChange={updateContinuousQueryParams}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-8' : 'col-span-2 row-start-7'}>
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={assessmentTool}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-9' : 'col-span-2 row-start-8'}>
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
      <div className={isFederationAPI ? 'row-start-10' : 'row-start-9'}>
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
