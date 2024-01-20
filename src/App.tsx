import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
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
import { queryURL, attributesURL, isFederationAPI, nodesURL,  sexes, modalities } from './utils/constants';

import './App.css';

function CategoricalField({
  label,
  options,
  onFieldChange,
  multiple,
  inputValue,
}: CategoricalFieldProps) {

  return (
    <Autocomplete
      options={options.sort((a, b) => a.label.localeCompare(b.label))}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={inputValue}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          InputLabelProps={params.InputLabelProps}
          label={label}
          placeholder='Select an option'
          className='w-full'
        />
      )}
      multiple={multiple}
      onChange={(_, value) => onFieldChange(label, value)}
    />
  );
}

CategoricalField.defaultProps = {
  multiple: false,
};

function ContinuousField({
  label,
  onFieldChange,
}: {
  label: string;
  onFieldChange: (fieldLabel: string, value: string) => void;
}) {
  return (
    // TODO: see if we can make it so TextField returns type number instead of string as its doing now
    <TextField
      type='number'
      label={label}
      className='w-full'
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
        <div className='grid grid-cols-12 items-center gap-2'>
          <div className='col-end-1'>
            <Checkbox />
          </div>
          <div className='col-span-10 col-start-1'>
            <Tooltip
              title={<Typography variant='body1'>{datasetName}</Typography>}
              placement='top'
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 500 }}
              enterDelay={500}
            >
              <Typography variant='h5' className='dataset-name'>
                {datasetName}
              </Typography>
            </Tooltip>
            <Typography variant='subtitle1'>from {nodeName}</Typography>
            <Typography variant='subtitle2'>
              {numMatchingSubjects} subjects match / {datasetTotalSubjects} total subjects
            </Typography>
          </div>
          <div className='col-span-2 justify-self-end'>
            <ButtonGroup>
              {imageModals.sort().map((modal) => (
                <Button key={modal} variant='text' className={modalities[modal].style}>
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
  // TODO: deal with no results
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
  nodeOptions,
  diagnosisOptions,
  assessmentOptions,
  apiQueryURL,
  onSubmitQuery,
}: {
  nodeOptions: NodeOption[]; 
  diagnosisOptions: AttributeOption[];
  assessmentOptions: AttributeOption[];
  apiQueryURL: string;
  onSubmitQuery: (url: string) => void;
}) {
  const [node, setNode] = useState<FieldInput>([{label: 'All', id: 'allNodes'}]);
  const [minAge, setMinAge] = useState<string | null>(null);
  const [maxAge, setMaxAge] = useState<string | null>(null);
  const [sex, setSex] = useState<FieldInput>(null);
  const [diagnosis, setDiagnosis] = useState<FieldInput>(null);
  const [isControl, setIsControl] = useState<boolean>(false);
  const [minNumSessions, setMinNumSessions] = useState<string | null>(null);
  const [assessmentTool, setAssessmentTool] = useState<FieldInput>(null);
  const [imagingModality, setImagingModality] = useState<FieldInput>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (nodeOptions.length > 1) {
      const searchParamNodes: string[] = searchParams.getAll('node');
      if (searchParamNodes) {
        const matchedOptions : FieldInputOption[] = searchParamNodes.map(label => {
          const foundOption = nodeOptions.find(option => option.NodeName === label);
          return foundOption ? {label, id: foundOption.ApiURL} : {label, id: ''};
        }).filter(option => option.id !== '');
        // If there is no node in the search params, set it to All
        if (matchedOptions.length === 0) {
          setSearchParams({ node: ['All']});
          setNode([{label: 'All', id: 'allNodes'}]);
        }
        // If there is any node besides All selected, remove All from the list
        else if (matchedOptions.length > 1 && matchedOptions.some(option => option.id === 'allNodes')) {
          const filteredNode : FieldInputOption[] = matchedOptions.filter((n) => n.id !== 'allNodes');
          setNode(filteredNode);
          setSearchParams({ node: filteredNode.map((n) => n.label)});
        }
        else {
          setNode(matchedOptions);
        }
      }
    }
  }, [searchParams, setSearchParams, nodeOptions]);

  function updateCategoricalQueryParams(fieldLabel: string, value: FieldInput) {
    switch (fieldLabel) {
      case 'Neurobagel graph':
        setNode(value);
        if (Array.isArray(value)) {
          setSearchParams({ node: value.map((n) => n.label)});
        }
        break;
      case 'Sex':
        setSex(value);
        break;
      case 'Diagnosis':
        setDiagnosis(value);
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
  
  function updateContinuousQueryParams(fieldLabel: string, value: string | null) {
    switch (fieldLabel) {
      case 'Min age':
        setMinAge(value);
        break;
      case 'Max age':
        setMaxAge(value);
        break;
      case 'Minimum number of sessions':
        setMinNumSessions(value);
        break;
      default:
        break;
    }
  }

  function setQueryParam(param: string, value: FieldInput, searchParamsObject: URLSearchParams) {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        searchParamsObject.append(param, v.id);
      })
    }
    else {
      searchParamsObject.set(param, value?.id ?? '');
    }
  }

  function constructQueryURL() {
    const queryParams = new URLSearchParams();

    setQueryParam('node_url', node, queryParams);
    queryParams.set('min_age', minAge ?? '');
    queryParams.set('max_age', maxAge ?? '');
    setQueryParam('sex', sex, queryParams);
    setQueryParam('diagnosis', isControl ? null : diagnosis, queryParams);
    queryParams.set('is_control', isControl ? 'true' : '');
    queryParams.set('min_num_sessions', minNumSessions ?? '');
    setQueryParam('assessment', assessmentTool, queryParams);
    setQueryParam('image_modal', imagingModality, queryParams);

    // Notes:
    // 1. Deleting elements in an array as we loop over it is not good, either make a new object or filter (same thing)
    // 2. using forEach on the QueryParams object, 
    // 3. Do the filtering first / switch before adding 
    // Solution:
    // Push the keys to be deleted inside keysToDelete and loop over them and delete them from queryParams afterwards
    const keysToDelete: string[] = [];

    queryParams.forEach((value, key) => {
      // if All option is selected for nodes field, delete all node_urls
      if (value === '' || value === 'allNodes') {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      queryParams.delete(key);
    });

    return `${apiQueryURL}${queryParams.toString()}`;
  }

  return (
    <div className={isFederationAPI ? 'grid grid-cols-2 grid-rows-8 gap-2' : 'grid grid-cols-2 grid-rows-7 gap-2'}>
      {
      isFederationAPI && (
      <div className='col-span-2'>
        <CategoricalField 
        label='Neurobagel graph'
        options={nodeOptions.map((n) => ({
          label: n.NodeName,
          id: n.ApiURL
        }))}
        onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)} 
        multiple
        inputValue={node}
        />
      </div>
        )
      }
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          label="Min age"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          label="Max age"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className='col-span-2'>
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
        <div className='grid grid-cols-12 items-center gap-4'>
          <div className='col-span-9'>
            <CategoricalField
              label='Diagnosis'
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
              control={<Checkbox name='healthyControl' />}
              label='Healthy Control'
              onChange={() => setIsControl(!isControl)}
            />
          </div>
        </div>
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-5' : 'col-span-2 row-start-4'}>
        <ContinuousField
          label='Minimum number of sessions'
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-6' : 'col-span-2 row-start-5'}>
        <CategoricalField
          label='Assessment tool'
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={assessmentTool}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-7' : 'col-span-2 row-start-6'}>
        <CategoricalField
          label='Imaging modality'
          options={Object.entries(modalities).map(([, value]) => ({
            label: value.label,
            id: value.TermURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={imagingModality}
        />
      </div>
      <div className={isFederationAPI ? 'row-start-8' : 'row-start-7'}>
        <Button
          variant='contained'
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

  const [diagnosisOptions, setDiagnosisOptions] = useState<AttributeOption[]>([]);
  const [assessmentOptions, setAssessmentOptions] = useState<AttributeOption[]>([]);
  const [nodeOptions, setNodeOptions] = useState<NodeOption[]>([{NodeName: 'All', ApiURL: 'allNodes'}]);
  const [result, setResult] = useState<Result[]>([]);

  useEffect( () => {
    async function fetchOptions(dataElementURI : string, setOptions : (options: AttributeOption[]) => void) {
      try {
        const response: AxiosResponse<RetrievedAttributeOption> = await axios.get(`${attributesURL}${dataElementURI}`);
        if (response.data[dataElementURI].length === 0) {
          // TODO: make into a toast
        } else {
          setOptions(response.data[dataElementURI]);
        }
      } catch (err) {
        // TODO: make into a toast
        console.log('Failed to retrieve attribtues options', err);
      }
    }

    async function fetchNodes() {
        try {
          const response: AxiosResponse<[]> = await axios.get(nodesURL);
          setNodeOptions([...response.data, {NodeName: 'All', ApiURL: 'allNodes'}]);
        }
        catch (err) {
          // TODO: make into a toast
          console.log('Failed to retrieve nodes', err);
        }
    }

    if (isFederationAPI) {
      fetchNodes();
    }

    fetchOptions('nb:Diagnosis', setDiagnosisOptions);
    fetchOptions('nb:Assessment', setAssessmentOptions);


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
    <div className='grid grid-cols-4 grid-rows-1 gap-4'>
      <div>
        <QueryForm nodeOptions={nodeOptions} diagnosisOptions={diagnosisOptions} assessmentOptions={assessmentOptions} apiQueryURL={queryURL} onSubmitQuery={(url: string) => submitQuery(url)} />
      </div>
      <div className='col-span-3'>
        <ResultContainer result={result} />
      </div>
    </div>
  );
}

interface FieldInputOption {
  label: string;
  id: string;
}

interface AttributeOption {
  Label: string;
  TermURL: string;
}

interface NodeOption {
  NodeName: string;
  ApiURL: string;
}

interface RetrievedAttributeOption {
  [key: string]: AttributeOption[];
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

interface CategoricalFieldProps {
  label: string;
  options: FieldInputOption[];
  onFieldChange: (fieldLabel: string, value: FieldInput) => void;
  multiple?: boolean;
  inputValue: FieldInput;
}

type FieldInput = FieldInputOption | FieldInputOption[] | null;

export default App;
