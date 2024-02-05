import { useState } from 'react';
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
  nodeOptions,
  diagnosisOptions,
  assessmentOptions,
  node,
  minAge,
  maxAge,
  sex,
  diagnosis,
  isControl,
  setIsControl,
  assessmentTool,
  imagingModality,
  updateCategoricalQueryParams,
  updateContinuousQueryParams,
  loading,
  onSubmitQuery,
}: {
  nodeOptions: NodeOption[];
  diagnosisOptions: AttributeOption[];
  assessmentOptions: AttributeOption[];
  node: FieldInput;
  minAge: number | null;
  maxAge: number | null;
  sex: FieldInput;
  diagnosis: FieldInput;
  isControl: boolean;
  setIsControl: (value: boolean) => void;
  assessmentTool: FieldInput;
  imagingModality: FieldInput;
  updateCategoricalQueryParams: (label: string, value: FieldInput) => void;
  updateContinuousQueryParams: (label: string, value: number | null) => void;
  loading: boolean;
  onSubmitQuery: () => void;
}) {
  const [minAgeError, setMinAgeError] = useState(false);
  const [minAgeHelperText, setMinAgeHelperText] = useState('');
  const [maxAgeError, setMaxAgeError] = useState(false);
  const [maxAgeHelperText, setMaxAgeHelperText] = useState('');
  const [minNumSessionsError, setMinNumSessionsError] = useState(false);
  const [minNumSessionsHelperText, setMinNumSessionsHelperText] = useState('');

  const minAgeBiggerThanMax: boolean = minAge && maxAge ? minAge > maxAge : false;
  const disableSubmit: boolean =
    minAgeBiggerThanMax || minAgeError || maxAgeError || minNumSessionsError;

  function validate(
    label: string,
    value: string,
    setError: React.Dispatch<React.SetStateAction<boolean>>,
    setHelperText: React.Dispatch<React.SetStateAction<string>>,
    min: number,
    max?: number
  ) {
    const numberValue: number = parseFloat(value);
    if (Number.isNaN(numberValue) && value !== '') {
      setError(true);
      setHelperText('Value must be a number');
      updateContinuousQueryParams(label, null);
      return;
    }
    if (numberValue < min) {
      setError(true);
      setHelperText(`Value must be greater than or equal to ${min}`);
    } else if (max && numberValue > max) {
      setError(true);
      setHelperText(`Value must be less than or equal to ${max}`);
    } else {
      setError(false);
      setHelperText('');
    }
    updateContinuousQueryParams(label, numberValue);
  }

  return (
    <div
      className={
        isFederationAPI
          ? 'grid grid-cols-2 grid-rows-9 gap-2'
          : 'grid grid-cols-2 grid-rows-8 gap-2'
      }
    >
      {isFederationAPI && (
        <div className="col-span-2">
          <CategoricalField
            label="Neurobagel graph"
            options={nodeOptions.map((n) => ({
              label: n.NodeName,
              id: n.ApiURL,
            }))}
            onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
            multiple
            inputValue={node}
          />
        </div>
      )}
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          error={minAgeBiggerThanMax || minAgeError}
          helperText={minAgeBiggerThanMax ? '' : minAgeHelperText}
          label="Minimum age"
          onFieldChange={(label, value) =>
            validate(label, value, setMinAgeError, setMinAgeHelperText, 0)
          }
        />
      </div>
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          error={minAgeBiggerThanMax || maxAgeError}
          helperText={minAgeBiggerThanMax ? '' : maxAgeHelperText}
          label="Maximum age"
          onFieldChange={(label, value) =>
            validate(label, value, setMaxAgeError, setMaxAgeHelperText, 0)
          }
        />
      </div>
      {minAgeBiggerThanMax && (
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
              inputValue={diagnosis}
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="healthyControl" />}
              label="Healthy Control"
              onChange={() => setIsControl(!isControl)}
            />
          </div>
        </div>
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-6' : 'col-span-2 row-start-5'}>
        <ContinuousField
          error={minNumSessionsError}
          helperText={minNumSessionsHelperText}
          label="Minimum number of sessions"
          onFieldChange={(label, value) =>
            validate(label, value, setMinNumSessionsError, setMinNumSessionsHelperText, 0)
          }
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-7' : 'col-span-2 row-start-6'}>
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={assessmentTool}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-8' : 'col-span-2 row-start-7'}>
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
      <div className={isFederationAPI ? 'row-start-9' : 'row-start-8'}>
        <Button
          disabled={disableSubmit}
          variant="contained"
          endIcon={
            loading ? (
              <CircularProgress size="20px" thickness={5.5} className="text-white" />
            ) : (
              <SendIcon />
            )
          }
          onClick={() => onSubmitQuery()}
        >
          Submit Query
        </Button>
      </div>
    </div>
  );
}

export default QueryForm;
