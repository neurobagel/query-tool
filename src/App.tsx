import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { Alert, Button, Grow, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import type { AlertColor } from '@mui/material/Alert';
import { SnackbarKey, SnackbarProvider, closeSnackbar, enqueueSnackbar } from 'notistack';
import { useAuth0 } from '@auth0/auth0-react';
import { v4 as uuidv4 } from 'uuid';
import { FilterList } from '@mui/icons-material';
import { baseAPIURL, nodesURL, enableAuth, enableChatbot } from './utils/constants';
import {
  RetrievedAttributeOption,
  AttributeOption,
  RetrievedPipelineVersions,
  NodeOption,
  FieldInput,
  FieldInputOption,
  Pipelines,
  DatasetsResponse,
  QueryParams,
  Notification,
  QueryFormState,
} from './utils/types';
import QueryForm from './components/QueryForm';
import ResultContainer from './components/ResultContainer';
import Navbar from './components/Navbar';
import AuthDialog from './components/AuthDialog';
import ChatbotFeature from './components/Chatbot';
import SmallScreenSizeDialog from './components/SmallScreenSizeDialog';
import ErrorAlert from './components/ErrorAlert';
import './App.css';
import logo from './assets/logo.png';
import areFormStatesEqual, { sendDatasetsQuery, sendSubjectsQuery } from './utils/utils';

function App() {
  // Screen is considered small if the width is less than 768px (according to tailwind docs)
  const [isScreenSizeSmall, setIsScreenSizeSmall] = useState<boolean>(
    useMediaQuery('(max-width: 767px)')
  );
  const [diagnosisOptions, setDiagnosisOptions] = useState<AttributeOption[]>([]);
  const [assessmentOptions, setAssessmentOptions] = useState<AttributeOption[]>([]);
  const [availableNodes, setAvailableNodes] = useState<NodeOption[]>([
    { NodeName: 'All', ApiURL: 'allNodes' },
  ]);
  const [pipelines, setPipelines] = useState<Pipelines>({});

  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [result, setResult] = useState<DatasetsResponse | null>(null);
  const [resultStatus, setResultStatus] = useState<string>('success');

  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');
  const [sex, setSex] = useState<FieldInput>(null);
  const [diagnosis, setDiagnosis] = useState<FieldInput>(null);
  const [minNumImagingSessions, setMinNumSessions] = useState<string>('');
  const [minNumPhenotypicSessions, setMinNumPhenotypicSessions] = useState<string>('');
  const [assessmentTool, setAssessmentTool] = useState<FieldInput>(null);
  const [imagingModality, setImagingModality] = useState<FieldInput>(null);
  const [pipelineVersion, setPipelineVersion] = useState<FieldInput>(null);
  const [pipelineName, setPipelineName] = useState<FieldInput>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeQueryParams, setActiveQueryParams] = useState<QueryParams | null>(null);
  const [activeQueryParamsState, setActiveQueryParamsState] = useState<QueryFormState | null>(null);
  const [hasFormChanged, setHasFormChanged] = useState<boolean>(false);

  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [IDToken, setIDToken] = useState<string | undefined>('');
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isQueryFormOpen, setIsQueryFormOpen] = useState(true);
  const isSmallViewport = useMediaQuery('(max-width: 1024px)');

  // Extract the raw OIDC ID token from the Auth0 SDK
  useEffect(() => {
    if (enableAuth && !isLoading) {
      if (isAuthenticated) {
        (async () => {
          const tokenClaims = await getIdTokenClaims();
          // eslint-disable-next-line no-underscore-dangle
          setIDToken(tokenClaims?.__raw);
        })();
        setOpenAuthDialog(false);
      }
      if (!isAuthenticated) {
        setOpenAuthDialog(true);
      } else {
        setOpenAuthDialog(false);
      }
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims]);

  const selectedNode: FieldInputOption[] = availableNodes
    .filter((option) => searchParams.getAll('node').includes(option.NodeName))
    .map((filteredOption) => ({ label: filteredOption.NodeName, id: filteredOption.ApiURL }));

  const sortedResults: DatasetsResponse | null = result
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

  const currentQueryFormState: QueryFormState = useMemo(
    () => ({
      nodes: [...searchParams.getAll('node')],
      minAge,
      maxAge,
      sex,
      diagnosis,
      minNumImagingSessions,
      minNumPhenotypicSessions,
      assessmentTool,
      imagingModality,
      pipelineName,
      pipelineVersion,
    }),
    [
      searchParams,
      minAge,
      maxAge,
      sex,
      diagnosis,
      minNumImagingSessions,
      minNumPhenotypicSessions,
      assessmentTool,
      imagingModality,
      pipelineName,
      pipelineVersion,
    ]
  );

  useEffect(() => {
    async function getAttributes(NBResource: string, dataElementURI: string) {
      try {
        const response: AxiosResponse<RetrievedAttributeOption> = await axios.get(
          `${baseAPIURL}${NBResource}`
        );
        if (response.data.nodes_response_status === 'fail') {
          enqueueSnackbar(`Failed to retrieve ${NBResource} options`, {
            variant: 'error',
            action,
          });
        } else {
          // If any errors occurred, report them
          response.data.errors.forEach((error) => {
            setNotifications((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: 'warning',
                message: `Failed to retrieve ${NBResource} options from ${error.node_name}`,
              },
            ]);
          });
          // If the results are empty, report that
          if (Object.keys(response.data.responses[dataElementURI]).length === 0) {
            setNotifications((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: 'info',
                message: `No ${NBResource} options were available`,
              },
            ]);
            // TODO: remove the second condition once pipeline labels are added
          } else if (
            response.data.responses[dataElementURI].some((item) => item.Label === null) &&
            NBResource !== 'pipelines'
          ) {
            setNotifications((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: 'warning',
                message: `Warning: Missing labels were removed for ${NBResource}`,
              },
            ]);
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

    getAttributes('diagnoses', 'nb:Diagnosis').then((diagnosisResponse) => {
      if (diagnosisResponse !== null && diagnosisResponse.length !== 0) {
        setDiagnosisOptions(diagnosisResponse);
      }
    });

    getAttributes('assessments', 'nb:Assessment').then((assessmentResponse) => {
      if (assessmentResponse !== null && assessmentResponse.length !== 0) {
        setAssessmentOptions(assessmentResponse);
      }
    });

    getAttributes('pipelines', 'nb:Pipeline').then((pipelineResponse) => {
      if (pipelineResponse !== null && pipelineResponse.length !== 0) {
        pipelineResponse.forEach((option) => {
          setPipelines((prevPipelines) => ({ ...prevPipelines, [option.TermURL]: [] }));
        });
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
        setNotifications((prev) => [
          ...prev,
          {
            id: uuidv4(),
            type: 'info',
            message: 'No options found for Node',
          },
        ]);
      } else {
        setAvailableNodes([...nodeResponse, { NodeName: 'All', ApiURL: 'allNodes' }]);
      }
    });
  }, []);

  useEffect(() => {
    async function getPipelineVersions(pipelineURI: FieldInputOption) {
      try {
        const response: AxiosResponse<RetrievedPipelineVersions> = await axios.get(
          `${baseAPIURL}pipelines/${pipelineURI.id}/versions`
        );
        if (response.data.nodes_response_status === 'fail') {
          enqueueSnackbar(`Failed to retrieve ${pipelineURI.label} versions`, {
            variant: 'error',
            action,
          });
        } else {
          // If any errors occurred, report them
          response.data.errors.forEach((error) => {
            setNotifications((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: 'warning',
                message: `Failed to retrieve ${pipelineURI.label} versions from ${error.node_name}`,
              },
            ]);
          });
          // If the results are empty, report that
          if (Object.keys(response.data.responses[pipelineURI.id]).length === 0) {
            setNotifications((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: 'info',
                message: `No ${pipelineURI.label} versions were available`,
              },
            ]);
          }
        }
        return response.data.responses[pipelineURI.id];
      } catch {
        return [];
      }
    }
    // Get pipeline versions if
    // 1. A pipeline has been selected (this implementation only works for single value for pipeline name field)
    // 2. This is the first time its being selected (i.e., we haven't retrieved pipeline versions before)
    if (
      pipelineName !== null &&
      !Array.isArray(pipelineName) &&
      pipelines[pipelineName.id].length === 0
    ) {
      getPipelineVersions(pipelineName).then((pipelineVersionsRespnse) => {
        setPipelines((prevPipelines) => ({
          ...prevPipelines,
          [pipelineName.id]: pipelineVersionsRespnse,
        }));
      });
    }
  }, [pipelines, pipelineName]);

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

  useEffect(() => {
    if (!activeQueryParams || !activeQueryParamsState) {
      setHasFormChanged(false);
      return;
    }

    setHasFormChanged(!areFormStatesEqual(currentQueryFormState, activeQueryParamsState));
  }, [activeQueryParams, activeQueryParamsState, currentQueryFormState]);

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
          // Case 1: User explicitly selected "All" after some other nodes were already selected.
          // in this case "All" would be the last option in the array
          // Approach: keep "All", remove all other options
          if (value.length > 1 && value[value.length - 1].label === 'All') {
            setSearchParams({ node: ['All'] });
            break;
          }

          // Case 2: User clicked the "x" dismiss button to clear all options.
          // in this case the selected options array would be empty
          // Approach: set "All" as the only option
          if (value.length === 0) {
            setSearchParams({ node: ['All'] });
            break;
          }

          // Case 3: User selected some nodes, but not "All" option.
          // in this case if "All" is present in the selected options array,
          // "All" would be the first option in the array leftover from being initially
          // set as the default or set as the fallback option when all options were cleared
          // Approach: Remove "All" if it was in the selected options and keep the rest
          const withoutAll = value.filter((n) => n.label !== 'All').map((n) => n.label);
          setSearchParams({ node: withoutAll });
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
      case 'Pipeline version':
        setPipelineVersion(value);
        break;
      case 'Pipeline name':
        setPipelineName(value);
        break;
      default:
        break;
    }
  }

  function updateContinuousQueryParams(fieldLabel: string, value: string) {
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

  function parseNumericParam(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }

  /**
   * Constructs the request body for the datasets endpoint.
   *
   * @returns The request body object.
   */
  function constructDatasetsRequestBody(): QueryParams {
    const requestBody: QueryParams = {
      nodes: [],
    };

    // If "All" is selected send empty array
    if (!selectedNode.some((n) => n.id === 'allNodes')) {
      requestBody.nodes = selectedNode.map((node) => ({ node_url: node.id }));
    }

    // Add optional parameters only if they have values
    const minAgeNumber = parseNumericParam(minAge);
    if (minAgeNumber !== null) requestBody.min_age = minAgeNumber;

    const maxAgeNumber = parseNumericParam(maxAge);
    if (maxAgeNumber !== null) requestBody.max_age = maxAgeNumber;
    if (sex && !Array.isArray(sex)) requestBody.sex = sex.id;
    if (diagnosis && !Array.isArray(diagnosis)) requestBody.diagnosis = diagnosis.id;
    const minNumImagingSessionsNumber = parseNumericParam(minNumImagingSessions);
    if (minNumImagingSessionsNumber !== null)
      requestBody.min_num_imaging_sessions = minNumImagingSessionsNumber;

    const minNumPhenotypicSessionsNumber = parseNumericParam(minNumPhenotypicSessions);
    if (minNumPhenotypicSessionsNumber !== null)
      requestBody.min_num_phenotypic_sessions = minNumPhenotypicSessionsNumber;
    if (assessmentTool && !Array.isArray(assessmentTool))
      requestBody.assessment = assessmentTool.id;
    if (imagingModality && !Array.isArray(imagingModality))
      requestBody.image_modal = imagingModality.id;
    if (pipelineName && !Array.isArray(pipelineName)) requestBody.pipeline_name = pipelineName.id;
    if (pipelineVersion && !Array.isArray(pipelineVersion) && pipelineName)
      requestBody.pipeline_version = pipelineVersion.id;

    return requestBody;
  }

  async function submitQuery() {
    setLoading(true);
    const datasetsRequestBody = constructDatasetsRequestBody();
    const formStateOnSubmit = currentQueryFormState;

    try {
      const data = await sendDatasetsQuery(datasetsRequestBody, IDToken);
      setResult(data);
      setResultStatus(data.nodes_response_status);
      setActiveQueryParams(datasetsRequestBody);
      setActiveQueryParamsState(formStateOnSubmit);
      setHasFormChanged(false);
    } catch {
      setResultStatus('network error');
    }

    setLoading(false);
  }

  function undoQueryFormChanges() {
    if (!activeQueryParamsState) {
      return;
    }

    setMinAge(activeQueryParamsState.minAge);
    setMaxAge(activeQueryParamsState.maxAge);
    setSex(activeQueryParamsState.sex);
    setDiagnosis(activeQueryParamsState.diagnosis);
    setMinNumSessions(activeQueryParamsState.minNumImagingSessions);
    setMinNumPhenotypicSessions(activeQueryParamsState.minNumPhenotypicSessions);
    setAssessmentTool(activeQueryParamsState.assessmentTool);
    setImagingModality(activeQueryParamsState.imagingModality);
    setPipelineName(activeQueryParamsState.pipelineName);
    setPipelineVersion(activeQueryParamsState.pipelineVersion);
    setSearchParams({ node: activeQueryParamsState.nodes });
  }

  const queryHasFailed = resultStatus !== 'success';
  const queryErrorMessage = result ? JSON.stringify(result.errors, null, 2) : '';
  const queryErrorMapping: {
    [key: string]: { errorTitle: string; explanation: React.ReactNode; severity: string };
  } = {
    'network error': {
      errorTitle: 'Unable to reach Neurobagel server',
      explanation: (
        <>
          We were unable to establish a connection to the Neurobagel server. This could indicate a
          network issue or a temporary problem with the server. Please check our internet connection
          and the Neurobagel status page at
          <a href="https://status.neurobagel.org/">https://status.neurobagel.org/</a> and then try
          again.
        </>
      ),
      severity: 'error',
    },
    'partial success': {
      errorTitle: 'Only some nodes responded',
      explanation: (
        <>
          Some of the selected nodes did not respond to the query. This could be a temporary issue,
          so a good idea is to try running your query again. If the issue persists, copy the error
          message below and open an issue on{' '}
          <a href="https://github.com/neurobagel/query-tool/issues">our GitHub page</a>.
        </>
      ),
      severity: 'warning',
    },
    fail: {
      errorTitle: 'No nodes responded',
      explanation: (
        <>
          The query failed because none of the selected nodes responded. This could be a temporary
          issue. Try to run your query again. If the issue persists, copy the error message below
          and open an issue on{' '}
          <a href="https://github.com/neurobagel/query-tool/issues/">our GitHub page</a>.
        </>
      ),
      severity: 'error',
    },
  };

  const queryFormHasChanged = Boolean(activeQueryParams && hasFormChanged);

  async function handleDownload(_buttonIndex: number, datasetSelection: string[]) {
    if (!activeQueryParams || !result) {
      throw new Error('No results available for download');
    }

    return sendSubjectsQuery(
      {
        queryParams: activeQueryParams,
        datasetSelection,
        datasetResponses: result.responses,
        nodes: availableNodes,
      },
      IDToken
    );
  }

  return (
    <>
      <AuthDialog open={openAuthDialog} onClose={() => setOpenAuthDialog(false)} />
      <SmallScreenSizeDialog open={isScreenSizeSmall} onClose={() => setIsScreenSizeSmall(false)} />
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={7}
      />
      <Navbar
        isLoggedIn={isAuthenticated}
        onLogin={() => setOpenAuthDialog(true)}
        notifications={notifications}
        setNotifications={setNotifications}
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
              contribute annotations for existing OpenNeuro datasets, please head over to&nbsp;
              <a href="https://upload-ui.neurobagel.org/" target="_blank" rel="noreferrer">
                Neurobagel&apos;s OpenNeuro utility service
              </a>
              &nbsp;which is designed to download and upload OpenNeuro datasets within Neurobagel
              ecosystem.
            </Alert>
          </Grow>
          <br />
        </>
      )}

      {enableChatbot && <ChatbotFeature setResult={setResult} />}

      <div className="flex flex-wrap gap-3">
        {/* 380px is currently the smallest width for the query form without dropdowns being affected */}
        {isSmallViewport && (
          <div className="flex w-full items-end justify-end p-2">
            <Button
              data-cy="filter-toggle-button"
              className="flex items-center gap-2"
              onClick={() => setIsQueryFormOpen(!isQueryFormOpen)}
            >
              <FilterList /> <span>{isQueryFormOpen ? 'Hide Query Form' : 'Show Query Form'}</span>
            </Button>
          </div>
        )}

        {(isQueryFormOpen || !isSmallViewport) && (
          <div data-cy="query-form-container" className="min-w-[380px] max-w-sm flex-1">
            <QueryForm
              availableNodes={availableNodes}
              diagnosisOptions={diagnosisOptions}
              assessmentOptions={assessmentOptions}
              selectedNode={selectedNode}
              minAge={minAge}
              maxAge={maxAge}
              sex={sex}
              diagnosis={diagnosis}
              minNumImagingSessions={minNumImagingSessions}
              minNumPhenotypicSessions={minNumPhenotypicSessions}
              assessmentTool={assessmentTool}
              imagingModality={imagingModality}
              pipelineVersion={pipelineVersion}
              pipelineName={pipelineName}
              pipelines={pipelines}
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
        )}
        <div
          className={
            loading
              ? 'flex flex-1 animate-pulse items-center justify-center'
              : 'min-w-[600px] flex-1'
          }
        >
          {loading ? (
            <img src={logo} alt="Logo " className="max-h-20 animate-bounce" />
          ) : (
            <>
              {queryHasFailed && (
                <ErrorAlert
                  errorTitle={queryErrorMapping[resultStatus].errorTitle}
                  errorContent={queryErrorMessage}
                  errorExplanation={queryErrorMapping[resultStatus].explanation}
                  severity={queryErrorMapping[resultStatus].severity as AlertColor}
                />
              )}
              {queryFormHasChanged && (
                <Alert
                  severity="error"
                  className="mb-2"
                  action={
                    <Button color="inherit" size="small" onClick={() => undoQueryFormChanges()}>
                      Undo changes
                    </Button>
                  }
                  data-cy="query-form-changed-alert"
                >
                  You have edited the query form fields since you&apos;ve submitted your query.
                  Downloading is disabled until you undo the changes or submit the new query.
                </Alert>
              )}
              <ResultContainer
                response={sortedResults || null}
                diagnosisOptions={diagnosisOptions}
                assessmentOptions={assessmentOptions}
                queryForm={activeQueryParams}
                disableDownloads={queryFormHasChanged}
                onDownload={(buttonIndex, selection) => handleDownload(buttonIndex, selection)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
