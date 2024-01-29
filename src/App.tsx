import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { queryURL, attributesURL, isFederationAPI, nodesURL } from './utils/constants';
import { RetrievedAttributeOption, AttributeOption, NodeOption, Result } from './utils/types';
import QueryForm from './components/QueryForm';
import ResultContainer from './components/ResultContainer';
import './App.css';

function App() {
  const [diagnosisOptions, setDiagnosisOptions] = useState<AttributeOption[]>([]);
  const [assessmentOptions, setAssessmentOptions] = useState<AttributeOption[]>([]);
  const [nodeOptions, setNodeOptions] = useState<NodeOption[]>([
    { NodeName: 'All', ApiURL: 'allNodes' },
  ]);
  const [result, setResult] = useState<Result[] | null>(null);

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
        setNodeOptions([...response.data, { NodeName: 'All', ApiURL: 'allNodes' }]);
      } catch (err) {
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
    <div className="grid grid-cols-4 grid-rows-1 gap-4">
      <div>
        <QueryForm
          nodeOptions={nodeOptions}
          diagnosisOptions={diagnosisOptions}
          assessmentOptions={assessmentOptions}
          apiQueryURL={queryURL}
          onSubmitQuery={(url: string) => submitQuery(url)}
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
  );
}

export default App;
