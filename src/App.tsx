import { useState } from 'react';
import axios from 'axios';
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
import { sexes, modalities } from './utils/constants';
import example from './utils/examples/example.json';
import diagnoses from './utils/examples/diagnoses.json';
import assessments from './utils/examples/assessments.json';

import './App.css';

const exampleResult: Result[] = example as Result[];
const modalityOptions: object = modalities;

function CategoricalField({label, options} : {label: string, options: object[]}) {
  return (
    <Autocomplete
    disablePortal
    options={options}
    renderInput={(params) => <TextField {...params} label={label} 
    />}
    />
  )
}

function ContinuousField({label} : {label:string}) {
  return (
    <TextField type='number' label={label} className='w-full' />
  )
}

function ResultCard({nodeName, datasetName, datasetTotalSubjects, numMatchingSubjects, imageModals} : {nodeName: string, datasetName: string, datasetTotalSubjects: number, numMatchingSubjects: number, imageModals: string[]}) {
  return (
    <Card>
      <CardContent>
        <div className='grid grid-cols-12 items-center gap-2'>
          <div className='col-end-1'>
            <Checkbox />
          </div>
          <div className='col-start-1 col-span-10'>
          <Tooltip title={
              <Typography variant='body1'>
                {datasetName}
              </Typography>
            } 
            placement='top' 
            TransitionComponent={Zoom} 
            TransitionProps={{ timeout: 500 }}
            enterDelay={500}
            >
              <Typography variant="h5" className='dataset-name'>{datasetName}</Typography>
            </Tooltip>
            <Typography variant="subtitle1">from {nodeName}</Typography>
            <Typography variant='subtitle2'>{numMatchingSubjects} subjects match / {datasetTotalSubjects} total subjects</Typography>
          </div>
          <div className='col-span-2 justify-self-end'>
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
  )
}

function ResultContainer({result} : {result: Result[]}) {
  return (
    <div className='grid gap-4'>
          {exampleResult.map((item) =>
          <ResultCard key={item.dataset_uuid} nodeName={item.node_name} datasetName={item.dataset_name} datasetTotalSubjects={item.dataset_total_subjects} numMatchingSubjects={item.num_matching_subjects} imageModals={item.image_modals} />
          )}
    </div>
  )
}

function QueryForm({onSubmitQuery} : {onSubmitQuery: () => void}) {
  return (
    <div className="grid grid-cols-2 grid-rows-7 gap-2">
        <ContinuousField label='Min Age'/>
        <ContinuousField label='Max Age'/>
      <div className='col-span-2'>
        <CategoricalField label='Sex' options={Object.entries(sexes).map(([key, value]) => ({
        label: key,
        id: value
        }))} 
        />
      </div>
      <div className='col-span-2 row-start-3'>
        <div className='grid grid-cols-12 gap-4 items-center'>
      <div className='col-span-9'>
          <CategoricalField 
          label='Diagnosis' 
          options={diagnoses["nb:Diagnosis"].map((d) => ({
          label: d.Label,
          id: d.TermURL
          }))}
          />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              name="healthyControl"
            />
          }
          label="Healthy Control"
        />
      </div>
      </div>
      </div>
      <div className='col-span-2 row-start-4'>
        <ContinuousField label='Minimum Number of Sessions'/>
      </div>
      <div className='col-span-2 row-start-5'>
        <CategoricalField label='Assessment tool' options={assessments["nb:Assessment"].map((a) => ({label: a.Label, id: a.TermURL}))}/>
      </div>
      <div className='col-span-2 row-start-6'>
        <CategoricalField label='Imaging modality' options={Object.entries(modalityOptions).map(([, value]) => ({label: value.label, id: value.TermURL}))}/>
      </div>
      <div className="row-start-7">
        <Button variant="contained" endIcon={<SendIcon />} onClick={onSubmitQuery}>
          Submit Query
        </Button>
      </div>
    </div>
  )
}

function App() {
  const [result, setResult] = useState<Result[]>([])

  function apiQueryURL() {
    const url: string = import.meta.env.VITE_API_QUERY_URL;
    return url.endsWith('/') ? `${url}query/?` : `${url}/query/?`;
  }

  async function submitQuery() {
    const url: string = `${apiQueryURL()}is_control=true`;
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
          <QueryForm onSubmitQuery={() => submitQuery()}/>
        </div>
        <div className="col-span-3">
          <ResultContainer result={result} />
        </div>
    </div>
  );
}

interface Result {
  node_name: string;
  dataset_uuid: number;
  dataset_name: string;
  dataset_portal_url: string;
  dataset_total_subjects: number;
  records_protected: boolean;
  num_matching_subjects: number;
  subject_data: object;
  image_modals: string[];
}

export default App;
