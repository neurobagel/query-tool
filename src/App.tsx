import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Alert, Button } from '@mui/material';
import { queryURL, attributesURL, isFederationAPI, nodesURL } from './utils/constants';
import { RetrievedAttributeOption, AttributeOption, NodeOption, Result } from './utils/types';
import QueryForm from './components/QueryForm';
import ResultContainer from './components/ResultContainer';
import Navbar from './components/Navbar';
import { useSnackStack } from './components/SnackStackProvider';
import SnackStack from './components/SnackStack';
import './App.css';

function App() {
  const [diagnosisOptions, setDiagnosisOptions] = useState<AttributeOption[]>([]);
  const [assessmentOptions, setAssessmentOptions] = useState<AttributeOption[]>([]);
  const [nodeOptions, setNodeOptions] = useState<NodeOption[]>([
    { NodeName: 'All', ApiURL: 'allNodes' },
  ]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Result[] | null>(null);

  const { addToast } = useSnackStack();

  useEffect(() => {
    async function fetchOptions(
      dataElementURI: string,
      setOptions: (options: AttributeOption[]) => void
    ) {
      try {
        const response: AxiosResponse<RetrievedAttributeOption> = await axios.get(
          `${attributesURL}${dataElementURI}`
        );
        if (response.data[dataElementURI].length === 0) {
          addToast({
            key: uuidv4(),
            message: `No options found for ${dataElementURI.slice(3)}`,
            severity: 'info',
          });
        } else {
          setOptions(response.data[dataElementURI]);
        }
      } catch (err) {
        addToast({
          key: uuidv4(),
          message: `Failed to retrieve options for ${dataElementURI.slice(3)}`,
          severity: 'error',
        });
      }
    }

    async function fetchNodes() {
      try {
        const response: AxiosResponse<[]> = await axios.get(nodesURL);
        setNodeOptions([...response.data, { NodeName: 'All', ApiURL: 'allNodes' }]);
      } catch (err) {
        addToast({
          key: uuidv4(),
          message: 'Failed to retrieve nodes',
          severity: 'error',
        });
      }
    }

    if (isFederationAPI) {
      fetchNodes();
    }

    fetchOptions('nb:Diagnosis', setDiagnosisOptions);
    fetchOptions('nb:Assessment', setAssessmentOptions);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function submitQuery(url: string) {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setResult(response.data);
    } catch (error) {
      addToast({
        key: uuidv4(),
        message: 'Failed to retrieve results',
        severity: 'error',
      });
    }
    setLoading(false);
  }

  return (
    <>
      <SnackStack />
      <Navbar />
      {showAlert && (
        <Alert 
        severity='info'
        action={
          <Button color="inherit" size="small">
            Dismiss
          </Button>
        }
        >
            The OpenNeuro node is being actively annotated at the participant level and does
            not include all datasets yet. Check back soon to find more data. If you would like
            to contribute annotations for existing OpenNeuro datasets, please get in touch through&nbsp;
            <a
              href="https://github.com/OpenNeuroDatasets-JSONLD/.github/issues"
              target="_blank" rel="noreferrer"
            >GitHub</a>.
        </Alert>
      )}
      
      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        <div>
          <QueryForm
            nodeOptions={nodeOptions}
            diagnosisOptions={diagnosisOptions}
            assessmentOptions={assessmentOptions}
            apiQueryURL={queryURL}
            loading={loading}
            onSubmitQuery={(url) => submitQuery(url)}
          />
        </div>
        <div className="col-span-3">
          <ResultContainer
            result={
              result ? result.sort((a, b) => a.dataset_name.localeCompare(b.dataset_name)) : null
            }
          />
        </div>
      </div>
    </>
  );
}

export default App;
