import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { Alert, Grow, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarKey, SnackbarProvider, closeSnackbar, enqueueSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
import { googleLogout } from '@react-oauth/google';
import { queryURL, attributesURL, nodesURL, enableAuth, enableChatbot } from './utils/constants';
import {
  RetrievedAttributeOption,
  AttributeOption,
  NodeOption,
  FieldInput,
  FieldInputOption,
  NodeError,
  QueryResponse,
  GoogleJWT,
} from './utils/types';
import QueryForm from './components/QueryForm';
import ResultContainer from './components/ResultContainer';
import Navbar from './components/Navbar';
import AuthDialog from './components/AuthDialog';
import ChatbotFeature from './components/Chatbot';
import './App.css';
import logo from './assets/logo.png';

function App() {
  const [diagnosisOptions, setDiagnosisOptions] = useState<AttributeOption[]>([]);
  const [assessmentOptions, setAssessmentOptions] = useState<AttributeOption[]>([]);
  const [availableNodes, setAvailableNodes] = useState<NodeOption[]>([
    { NodeName: 'All', ApiURL: 'allNodes' },
  ]);

  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [result, setResult] = useState<QueryResponse | null>(null);

  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [sex, setSex] = useState<FieldInput>(null);
  const [diagnosis, setDiagnosis] = useState<FieldInput>(null);
  const [isControl, setIsControl] = useState<boolean>(false);
  const [minNumImagingSessions, setMinNumSessions] = useState<number | null>(null);
  const [minNumPhenotypicSessions, setMinNumPhenotypicSessions] = useState<number | null>(null);
  const [assessmentTool, setAssessmentTool] = useState<FieldInput>(null);
  const [imagingModality, setImagingModality] = useState<FieldInput>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [openAuthDialog, setOpenAuthDialog] = useState(true);
  const [name, setName] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [IDToken, setIDToken] = useState<string | undefined>('');

  const selectedNode: FieldInputOption[] = availableNodes
    .filter((option) => searchParams.getAll('node').includes(option.NodeName))
    .map((filteredOption) => ({ label: filteredOption.NodeName, id: filteredOption.ApiURL }));

  const sortedResults: QueryResponse | null = result
    ? {
        ...result,
        responses: result.responses.sort((a, b) => a.dataset_name.localeCompare(b.dataset_name)),
      }
    : null;

  const action = (snackbarId: SnackbarKey) => (
    <IconButton
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      <CloseIcon className="text-white" />
    </IconButton>
  );

  useEffect(() => {
    async function getAttributes(dataElementURI: string) {
      try {
        const response: AxiosResponse<RetrievedAttributeOption> = await axios.get(
          `${attributesURL}${dataElementURI}`
        );
        if (response.data.nodes_response_status === 'fail') {
          enqueueSnackbar(`Failed to retrieve ${dataElementURI.slice(3)} options`, {
            variant: 'error',
            action,
          });
        } else {
          // If any errors occurred, report them
          response.data.errors.forEach((error) => {
            enqueueSnackbar(
              `Failed to retrieve ${dataElementURI.slice(3)} options from ${error.node_name}`,
              { variant: 'warning', action }
            );
          });
          // If the results are empty, report that
          if (Object.keys(response.data.responses[dataElementURI]).length === 0) {
            enqueueSnackbar(`No ${dataElementURI.slice(3)} options were available`, {
              variant: 'info',
              action,
            });
          } else if (response.data.responses[dataElementURI].some((item) => item.Label === null)) {
            enqueueSnackbar(
              `Warning: Missing labels were removed for ${dataElementURI.slice(3)} `,
              { variant: 'warning', action }
            );
            response.data.responses[dataElementURI] = response.data.responses[
              dataElementURI
            ].filter((item) => item.Label !== null);
          }
        }
        return response.data.responses[dataElementURI];
      } catch {
        return null;
      }
    }

    getAttributes('nb:Diagnosis').then((diagnosisResponse) => {
      if (diagnosisResponse !== null && diagnosisResponse.length !== 0) {
        setDiagnosisOptions(diagnosisResponse);
      }
    });

    getAttributes('nb:Assessment').then((assessmentResponse) => {
      if (assessmentResponse !== null && assessmentResponse.length !== 0) {
        setAssessmentOptions(assessmentResponse);
      }
    });

    async function getNodeOptions(fetchURL: string) {
      try {
        const response: AxiosResponse<NodeOption[]> = await axios.get(fetchURL);
        return response.data;
      } catch {
        return null;
      }
    }

    getNodeOptions(nodesURL).then((nodeResponse) => {
      if (nodeResponse === null) {
        enqueueSnackbar('Failed to retrieve Node options', { variant: 'error', action });
      } else if (nodeResponse.length === 0) {
        enqueueSnackbar('No options found for Node', { variant: 'info', action });
      } else {
        setAvailableNodes([...nodeResponse, { NodeName: 'All', ApiURL: 'allNodes' }]);
      }
    });
  }, []);

  useEffect(() => {
    if (availableNodes.length > 1) {
      const searchParamNodes: string[] = searchParams.getAll('node');

      if (searchParamNodes) {
        const matchedNodeNames: string[] = searchParamNodes.filter((nodeName) =>
          availableNodes.some((option) => option.NodeName === nodeName)
        );

        // If there is no node in the search params, set it to All
        if (matchedNodeNames.length === 0) setSearchParams({ node: ['All'] });
        // If there is any node besides All selected, remove All from the list
        else if (matchedNodeNames.length > 1 && matchedNodeNames.includes('All')) {
          const filteredNodeNames = matchedNodeNames.filter((nodeName) => nodeName !== 'All');
          setSearchParams({ node: filteredNodeNames });
        }
      }
    }
  }, [searchParams, setSearchParams, availableNodes]);

  function showAlert() {
    if (selectedNode && Array.isArray(selectedNode)) {
      const openNeuroIsAnOption = availableNodes.find((n) => n.NodeName === 'OpenNeuro');
      const isOpenNeuroSelected = selectedNode.find(
        (n) => n.label === 'OpenNeuro' || (n.label === 'All' && openNeuroIsAnOption)
      );
      return isOpenNeuroSelected && !alertDismissed;
    }
    return alertDismissed;
  }

  function updateCategoricalQueryParams(fieldLabel: string, value: FieldInput) {
    switch (fieldLabel) {
      case 'Neurobagel graph':
        if (Array.isArray(value)) {
          // If no option is selected default to All
          if (value.length === 0) {
            setSearchParams({ node: ['All'] });
            // If any option beside All is selected, remove All
          } else if (value.length > 1) {
            setSearchParams({ node: value.filter((n) => n.label !== 'All').map((n) => n.label) });
          } else {
            setSearchParams({ node: value.map((n) => n.label) });
          }
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
      case 'Minimum number of imaging sessions':
        setMinNumSessions(value);
        break;
      case 'Minimum number of phenotypic sessions':
        setMinNumPhenotypicSessions(value);
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

    setQueryParam('node_url', selectedNode, queryParams);
    queryParams.set('min_age', minAge ? minAge.toString() : '');
    queryParams.set('max_age', maxAge ? maxAge.toString() : '');
    setQueryParam('sex', sex, queryParams);
    setQueryParam('diagnosis', isControl ? null : diagnosis, queryParams);
    queryParams.set('is_control', isControl ? 'true' : '');
    queryParams.set(
      'min_num_imaging_sessions',
      minNumImagingSessions ? minNumImagingSessions.toString() : ''
    );
    queryParams.set(
      'min_num_phenotypic_sessions',
      minNumPhenotypicSessions ? minNumPhenotypicSessions.toString() : ''
    );
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
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${IDToken}`,
          'Content-Type': 'application/json',
        },
      });
      setResult(response.data);
      switch (response.data.nodes_response_status) {
        case 'partial success': {
          response.data.errors.forEach((error: NodeError) => {
            enqueueSnackbar(`${error.node_name} failed to respond`, {
              variant: 'warning',
              action,
            });
          });
          break;
        }
        case 'fail': {
          enqueueSnackbar('Error: All nodes failed to respond', { variant: 'error', action });
          break;
        }
        default: {
          break;
        }
      }
    } catch {
      enqueueSnackbar('Failed to retrieve results', { variant: 'error', action });
    }
    setLoading(false);
  }

  function login(credential: string | undefined) {
    setIsLoggedIn(true);
    setOpenAuthDialog(false);
    const jwt: GoogleJWT = credential ? jwtDecode(credential) : ({} as GoogleJWT);
    setIDToken(credential);
    setName(jwt.given_name);
    setProfilePic(jwt.picture);
  }

  function logout() {
    googleLogout();
    setIsLoggedIn(false);
    setIDToken('');
    setName('');
    setProfilePic('');
  }

  return (
    <>
      <div>
        {enableAuth && (
          <AuthDialog
            open={openAuthDialog}
            onAuth={(credential) => login(credential)}
            onClose={() => setOpenAuthDialog(false)}
          />
        )}
      </div>
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={7}
      />
      <Navbar
        isLoggedIn={isLoggedIn}
        name={name}
        profilePic={profilePic}
        onLogout={() => logout()}
        onLogin={() => setOpenAuthDialog(true)}
      />
      {showAlert() && (
        <>
          <Grow in={!alertDismissed}>
            <Alert
              data-cy="openneuro-alert"
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

      <div>{enableChatbot && <ChatbotFeature setResult={setResult} />}</div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <QueryForm
            availableNodes={availableNodes}
            diagnosisOptions={diagnosisOptions}
            assessmentOptions={assessmentOptions}
            selectedNode={selectedNode}
            minAge={minAge}
            maxAge={maxAge}
            sex={sex}
            diagnosis={diagnosis}
            isControl={isControl}
            minNumImagingSessions={minNumImagingSessions}
            minNumPhenotypicSessions={minNumPhenotypicSessions}
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
        <div
          className={loading ? 'col-span-3 grid animate-pulse place-items-center' : 'col-span-3'}
        >
          {loading ? (
            <img src={logo} alt="Logo" height="80" className="animate-spin" />
          ) : (
            <ResultContainer response={sortedResults || null} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
