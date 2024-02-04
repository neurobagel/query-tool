import { Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
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

  return (
    <div
      className={
        isFederationAPI
          ? 'grid grid-cols-2 grid-rows-8 gap-2'
          : 'grid grid-cols-2 grid-rows-7 gap-2'
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
          min={0}
          label="Min age"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          min={minAge || 0}
          label="Max age"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
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
      <div className={isFederationAPI ? 'col-span-2 row-start-4' : 'col-span-2 row-start-3'}>
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
      <div className={isFederationAPI ? 'col-span-2 row-start-5' : 'col-span-2 row-start-4'}>
        <ContinuousField
          min={0}
          label="Minimum number of sessions"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-6' : 'col-span-2 row-start-5'}>
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={assessmentTool}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-7' : 'col-span-2 row-start-6'}>
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
      <div className={isFederationAPI ? 'row-start-8' : 'row-start-7'}>
        {/* TODO: Disable button when there is an error */}
        <Button
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
