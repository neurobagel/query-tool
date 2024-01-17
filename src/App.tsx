import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { queryURL, attributesURL, sexes, modalities } from './utils/constants';

import './App.css';

const modalityOptions: object = modalities;

function CategoricalField({
  label,
  options,
  onFieldChange,
}: {
  label: string;
  options: InputOption[];
  onFieldChange: (fieldLabel: string, value: string | null) => void;
}) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          InputLabelProps={params.InputLabelProps}
          label={label}
          className="w-full"
        />
      )}
      onChange={(_, value) => onFieldChange(label, value?.id ?? null)}
    />
  );
}

function ContinuousField({
  label,
  onFieldChange,
}: {
  label: string;
  onFieldChange: (fieldLabel: string, value: string) => void;
}) {
  return (
    <TextField
      type="number"
      label={label}
      className="w-full"
      onChange={(event) => onFieldChange(label, event.target.value)}
    />
  );
}

function ResultCard({
  nodeName,
  datasetName,
  datasetTotalSubjects,
  numMatchingSubjects,
  imageModals,
}: {
  nodeName: string;
  datasetName: string;
  datasetTotalSubjects: number;
  numMatchingSubjects: number;
  imageModals: string[];
}) {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-end-1">
            <Checkbox />
          </div>
          <div className="col-span-10 col-start-1">
            <Tooltip
              title={<Typography variant="body1">{datasetName}</Typography>}
              placement="top"
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 500 }}
              enterDelay={500}
            >
              <Typography variant="h5" className="dataset-name">
                {datasetName}
              </Typography>
            </Tooltip>
            <Typography variant="subtitle1">from {nodeName}</Typography>
            <Typography variant="subtitle2">
              {numMatchingSubjects} subjects match / {datasetTotalSubjects} total subjects
            </Typography>
          </div>
          <div className="col-span-2 justify-self-end">
            <ButtonGroup>
              {imageModals.sort().map((modal) => (
                <Button key={modal} variant="text" className={modalities[modal].style}>
                  {modalities[modal].name}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultContainer({ result }: { result: Result[] }) {
  return (
    <div className="grid gap-4">
      {result.map((item) => (
        <ResultCard
          key={item.dataset_uuid}
          nodeName={item.node_name}
          datasetName={item.dataset_name}
          datasetTotalSubjects={item.dataset_total_subjects}
          numMatchingSubjects={item.num_matching_subjects}
          imageModals={item.image_modals}
        />
      ))}
    </div>
  );
}

function QueryForm({
  diagnosisOptions,
  assessmentOptions,
  apiQueryURL,
  onSubmitQuery,
}: {
  diagnosisOptions: APIOption[];
  assessmentOptions: APIOption[];
  apiQueryURL: string;
  onSubmitQuery: (url: string) => void;
}) {
  const [minAge, setMinAge] = useState<string | null>(null);
  const [maxAge, setMaxAge] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [isControl, setIsControl] = useState<boolean>(false);
  const [minNumSessions, setMinNumSessions] = useState<string | null>(null);
  const [assessmentTool, setAssessmentTool] = useState<string | null>(null);
  const [imagingModality, setImagingModality] = useState<string | null>(null);;

  function updateQueryParams(fieldLabel: string, value: string | null) {
    switch (fieldLabel) {
      case 'Min Age':
        setMinAge(value);
        break;
      case 'Max Age':
        setMaxAge(value);
        break;
      case 'Sex':
        setSex(value);
        break;
      case 'Diagnosis':
        setDiagnosis(value);
        break;
      case 'Minimum number of sessions':
        setMinNumSessions(value);
        break;
      case 'Assessment tool':
        setAssessmentTool(value);
        break;
      case 'Imaging modality':
        setImagingModality(value);
        break;
      default:
        break;
    }
  }

  function constructQueryURL() {
    const queryParams = new URLSearchParams();
    queryParams.set('min_age', minAge ?? '');
    queryParams.set('max_age', maxAge ?? '');
    queryParams.set('sex', sex ?? '');
    // TODO: Double check the is_control param passing
    queryParams.set('diagnosis', diagnosis && !isControl ? diagnosis : '');
    queryParams.set('min_num_sessions', minNumSessions ?? '');
    queryParams.set('is_control', isControl ? 'true' : '');
    queryParams.set('assessment', assessmentTool ?? '');
    queryParams.set('image_modal', imagingModality ?? '');

    // Notes:
    // 1. Deleting elements in an array as we loop over it is not good, either make a new object or filter (same thing)
    // 2. using forEach on the QueryParams object, 
    // 3. Do the filtering first / switch before adding 
    // Solution:
    // Push the keys to be deleted inside keysToDelete and loop over them and delete them from queryParams afterwards
    
    const keysToDelete: string[] = [];

    queryParams.forEach((value, key) => {
      if (value === '') {
        keysToDelete.push(key);
      } 
    });

    keysToDelete.forEach((key) => {
      queryParams.delete(key);
    });

    return `${apiQueryURL}${queryParams.toString()}`;
  }

  return (
    <div className="grid grid-cols-2 grid-rows-7 gap-2">
      <ContinuousField
        label="Min Age"
        onFieldChange={(label, value) => updateQueryParams(label, value)}
      />
      <ContinuousField
        label="Max Age"
        onFieldChange={(label, value) => updateQueryParams(label, value)}
      />
      <div className="col-span-2">
        <CategoricalField
          label="Sex"
          options={Object.entries(sexes).map(([key, value]) => ({
            label: key,
            id: value,
          }))}
          onFieldChange={(label, value) => updateQueryParams(label, value)}
        />
      </div>
      <div className="col-span-2 row-start-3">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-9">
            <CategoricalField
              label="Diagnosis"
              options={diagnosisOptions.map((d) => ({
                label: d.Label,
                id: d.TermURL,
              }))}
              onFieldChange={(label, value) => updateQueryParams(label, value)}
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
      <div className="col-span-2 row-start-4">
        <ContinuousField
          label="Minimum number of sessions"
          onFieldChange={(label, value) => updateQueryParams(label, value)}
        />
      </div>
      <div className="col-span-2 row-start-5">
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateQueryParams(label, value)}
        />
      </div>
      <div className="col-span-2 row-start-6">
        <CategoricalField
          label="Imaging modality"
          options={Object.entries(modalityOptions).map(([, value]) => ({
            label: value.label,
            id: value.TermURL,
          }))}
          onFieldChange={(label, value) => updateQueryParams(label, value)}
        />
      </div>
      <div className="row-start-7">
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => onSubmitQuery(constructQueryURL())}
        >
          Submit Query
        </Button>
      </div>
    </div>
  );
}

function App() {

  const [diagnosisOptions, setDiagnosisOptions] = useState<APIOption[]>([]);
  const [assessmentOptions, setAssessmentOptions] = useState<APIOption[]>([]);
  const [result, setResult] = useState<Result[]>([]);

  useEffect( () => {
    async function fetchData(dataElementURI : string, setState : (options: APIOption[]) => void) {
      try {
        const response: AxiosResponse<RetrievedOption> = await axios.get(`${attributesURL}${dataElementURI}`);
        if (response.data[dataElementURI].length === 0) {
          // TODO: make into a toast
        } else {
          setState(response.data[dataElementURI].sort((a, b) => a.Label.localeCompare(b.Label)));
        }
      } catch (err) {
        // TODO: make into a toast
        console.log('Failed to retrieve diagnosis options', err);
      }
    }

    fetchData('nb:Diagnosis', setDiagnosisOptions);
    fetchData('nb:Assessment', setAssessmentOptions);
  }, []);

  async function submitQuery(url: string) {
    try {
      const response = await axios.get(url);
      setResult(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grid grid-cols-4 grid-rows-1 gap-4">
      <div>
        <QueryForm diagnosisOptions={diagnosisOptions} assessmentOptions={assessmentOptions} apiQueryURL={queryURL} onSubmitQuery={(url: string) => submitQuery(url)} />
      </div>
      <div className="col-span-3">
        <ResultContainer result={result} />
      </div>
    </div>
  );
}

interface Result {
  node_name: string;
  dataset_uuid: string;
  dataset_name: string;
  dataset_portal_uri: string;
  dataset_total_subjects: number;
  records_protected: boolean;
  num_matching_subjects: number;
  subject_data: object;
  image_modals: string[];
}

interface InputOption {
  label: string;
  id: string;
}

interface APIOption {
  Label: string;
  TermURL: string;
}

interface RetrievedOption {
  [key: string]: APIOption[];
}

export default App;
