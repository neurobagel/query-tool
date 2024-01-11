import { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import example from './example.json';

import './App.css';

function ResultCard({nodeName, datasetName, datasetTotalSubjects, numMatchingSubjects, imageModals} : {nodeName: string, datasetName: string, datasetTotalSubjects: number, numMatchingSubjects: number, imageModals: string[]}) {
  const modalities: {[key: string]: {name: string, style: string}} = {
    'http://purl.org/nidash/nidm#ArterialSpinLabeling': {
      name: 'ASL',
      style: 'modality-style-1',
    },
    'http://purl.org/nidash/nidm#DiffusionWeighted': {
      name: 'DWI',
      style: 'modality-style-2',
    },
    'http://purl.org/nidash/nidm#EEG':
    {
      name: 'EEG',
      style: 'modality-style-3',
    },
    'http://purl.org/nidash/nidm#FlowWeighted':
    {
      name: 'Flow',
      style: 'modality-style-4',
    },
    'http://purl.org/nidash/nidm#T1Weighted': {
      name: 'T1',
      style: 'modality-style-5',
    },
    'http://purl.org/nidash/nidm#T2Weighted': {
      name: 'T2',
      style: 'modality-style-6',
    },
  };
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} wrap='nowrap' justifyContent='space-between' alignItems='center'>
          <Checkbox />
          <Grid item columns={7}>
            <h3>{datasetName}</h3>
            <p>{numMatchingSubjects} subjects / {datasetTotalSubjects} total subjects</p>
          </Grid>
          <Grid item columns={3}>
            <p>from {nodeName}</p>
            <ButtonGroup>
              {imageModals.map((modal) => (
                <Button key={modal} className={modalities[modal].style}>
                  {modalities[modal].name}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

function ResultContainer({result} : {result: Result[]}) {
  return (
    <Stack spacing={2}>
          {example.map((item) =>
          <ResultCard nodeName={item.node_name} datasetName={item.dataset_name} datasetTotalSubjects={item.dataset_total_subjects} numMatchingSubjects={item.num_matching_subjects} imageModals={item.image_modals} />
          )}
    </Stack>
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
    <>
        <Button variant="contained" endIcon={<SendIcon />} onClick={() => submitQuery()}>
          Submit Query
        </Button>
        <ResultContainer result={result} />
    </>
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
