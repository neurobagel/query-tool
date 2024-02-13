import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Alert, Grow } from '@mui/material';
import { queryURL, attributesURL, isFederationAPI, nodesURL } from './utils/constants';
import {
  RetrievedAttributeOption,
  AttributeOption,
  NodeOption,
  FieldInput,
  FieldInputOption,
  Result,
} from './utils/types';
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

  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [result, setResult] = useState<Result[] | null>(null);

  const [node, setNode] = useState<FieldInput>([{ label: 'All', id: 'allNodes' }]);
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [sex, setSex] = useState<FieldInput>(null);
  const [diagnosis, setDiagnosis] = useState<FieldInput>(null);
  const [isControl, setIsControl] = useState<boolean>(false);
  const [minNumSessions, setMinNumSessions] = useState<number | null>(null);
  const [assessmentTool, setAssessmentTool] = useState<FieldInput>(null);
  const [imagingModality, setImagingModality] = useState<FieldInput>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { addToast } = useSnackStack();

  useEffect(() => {
    async function tryThisOptionsGetter(dataElementURI: string) {
      try {
        const response: AxiosResponse<RetrievedAttributeOption> = await axios.get(
          `${attributesURL}${dataElementURI}`
        );
        return response.data[dataElementURI];
      }
      catch (err) {
        return null;
      }
    }

    tryThisOptionsGetter('nb:Diagnosis').then(diagnosisResponse => {
      if (diagnosisResponse === null) {
        addToast({
          key: uuidv4(),
          message: `Failed to retrieve Diagnosis options`,
          severity: 'error',
        });
      } else if (diagnosisResponse.length === 0) {
        addToast({
          key: uuidv4(),
          message: `No options found for Diagnosis`,
          severity: 'info',
        });
      } else {
        setDiagnosisOptions(diagnosisResponse);
      }
    });

    tryThisOptionsGetter('nb:Assessment').then(assessmentResponse => {
      if (assessmentResponse === null) {
        addToast({
          key: uuidv4(),
          message: `Failed to retrieve Assessment Tool options`,
          severity: 'error',
        });
      } else if (assessmentResponse.length === 0) {
        addToast({
          key: uuidv4(),
          message: `No options found for Assessment Tool`,
          severity: 'info',
        });
      } else {
        setAssessmentOptions(assessmentResponse);
      }
    });

    async function getNodeOptions(fetchURL: string) {
      try {
        const response: AxiosResponse<NodeOption[]> = await axios.get(fetchURL);
        return response.data;
      }
      catch (err) {
        return null;
      }
    }

    if (isFederationAPI) {
      getNodeOptions(nodesURL).then(nodeResponse => {
        if (nodeResponse === null) {
          addToast({
            key: uuidv4(),
            message: `Failed to retrieve Node options`,
            severity: 'error',
          });
        } else if (nodeResponse.length === 0) {
          addToast({
            key: uuidv4(),
            message: `No options found for Node`,
            severity: 'info',
          });
        } else {
          setNodeOptions([...nodeResponse, { NodeName: 'All', ApiURL: 'allNodes' }]);
        }
      });
    }

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nodeOptions.length > 1) {
      const searchParamNodes: string[] = searchParams.getAll('node');
      if (searchParamNodes) {
        const matchedOptions: FieldInputOption[] = searchParamNodes
          .map((nodeName) => {
            const foundOption = nodeOptions.find((option) => option.NodeName === nodeName);
            return foundOption ? { label: nodeName, id: foundOption.ApiURL } : { label: nodeName, id: '' };
          })
          .filter((option) => option.id !== '');
        // If there is no node in the search params, set it to All
        if (matchedOptions.length === 0) {
          setSearchParams({ node: ['All'] });
          setNode([{ label: 'All', id: 'allNodes' }]);
        }
        // If there is any node besides All selected, remove All from the list
        else if (
          matchedOptions.length > 1 &&
          matchedOptions.some((option) => option.id === 'allNodes')
        ) {
          const filteredNode: FieldInputOption[] = matchedOptions.filter(
            (n) => n.id !== 'allNodes'
          );
          setNode(filteredNode);
          setSearchParams({ node: filteredNode.map((n) => n.label) });
        } else {
          setNode(matchedOptions);
        }
      }
    }
  }, [searchParams, setSearchParams, nodeOptions, node]);

  function showAlert() {
    if (node && Array.isArray(node)) {
      const openNeurIsAnoOption = nodeOptions.find((n) => n.NodeName === 'OpenNeuro');
      const isOpenNeuroSelected = node.find(
        (n) => n.label === 'OpenNeuro' || (n.label === 'All' && openNeurIsAnoOption)
      );
      return isOpenNeuroSelected && !alertDismissed;
    }
    return alertDismissed;
  }

  function updateCategoricalQueryParams(fieldLabel: string, value: FieldInput) {
    switch (fieldLabel) {
      case 'Neurobagel graph':
        setNode(value);
        if (Array.isArray(value)) {
          setSearchParams({ node: value.map((n) => n.label) });
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

  function updateContinuousQueryParams(fieldLabel: string, value: number | null) {
    switch (fieldLabel) {
      case 'Minimum age':
        setMinAge(value);
        break;
      case 'Maximum age':
        setMaxAge(value);
        break;
      case 'Minimum number of sessions':
        setMinNumSessions(value);
        break;
      default:
        break;
    }
  }

  /**
   * Sets the value of a query parameter on the query parameter object.
   *
   * @remarks
   * This is a utility function to used to help construct the query URL using a URLSearchParams object.
   *
   * @param param - The name of the query parameter
   * @param value - The value of the query parameter
   * @param queryParamObject - The query parameter object which contains the query parameters
   * @returns void
   */
  function setQueryParam(param: string, value: FieldInput, queryParamObject: URLSearchParams) {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParamObject.append(param, v.id);
      });
    } else {
      queryParamObject.set(param, value?.id ?? '');
    }
  }

  /**
   * Creates the query URL from user input using a URLSearchParams object.
   *
   * @remarks
   * This function utilizes the `setQueryParam` function to set categorical query parameters.
   *
   * @returns The query URL.
   */
  function constructQueryURL() {
    const queryParams = new URLSearchParams();

    setQueryParam('node_url', node, queryParams);
    queryParams.set('min_age', minAge ? minAge.toString() : '');
    queryParams.set('max_age', maxAge ? maxAge.toString() : '');
    setQueryParam('sex', sex, queryParams);
    setQueryParam('diagnosis', isControl ? null : diagnosis, queryParams);
    queryParams.set('is_control', isControl ? 'true' : '');
    queryParams.set('min_num_sessions', minNumSessions ? minNumSessions.toString() : '');
    setQueryParam('assessment', assessmentTool, queryParams);
    setQueryParam('image_modal', imagingModality, queryParams);

    // Remove keys with empty values
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

    return `${queryURL}${queryParams.toString()}`;
  }

  async function submitQuery() {
    setLoading(true);
    const url: string = constructQueryURL();
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
      {showAlert() && (
        <>
          <Grow in={!alertDismissed}>
            <Alert
              severity="info"
              onClose={() => {
                setAlertDismissed(true);
              }}
            >
              The OpenNeuro node is being actively annotated at the participant level and does not
              include all datasets yet. Check back soon to find more data. If you would like to
              contribute annotations for existing OpenNeuro datasets, please get in touch
              through&nbsp;
              <a
                href="https://github.com/OpenNeuroDatasets-JSONLD/.github/issues"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              .
            </Alert>
          </Grow>
          <br />
        </>
      )}

      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        <div>
          <QueryForm
            nodeOptions={nodeOptions}
            diagnosisOptions={diagnosisOptions}
            assessmentOptions={assessmentOptions}
            node={node}
            minAge={minAge}
            maxAge={maxAge}
            sex={sex}
            diagnosis={diagnosis}
            isControl={isControl}
            minNumSessions={minNumSessions}
            setIsControl={setIsControl}
            assessmentTool={assessmentTool}
            imagingModality={imagingModality}
            updateCategoricalQueryParams={(label, value) =>
              updateCategoricalQueryParams(label, value)
            }
            updateContinuousQueryParams={(label, value) =>
              updateContinuousQueryParams(label, value)
            }
            loading={loading}
            onSubmitQuery={() => submitQuery()}
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
