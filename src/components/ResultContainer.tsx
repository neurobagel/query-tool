import { useState, useEffect, useCallback } from 'react';
import { FormControlLabel, Checkbox, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import ResultCard from './ResultCard';
import {
  DatasetsResponse,
  SubjectsResponse,
  DatasetsRequestBody,
  SubjectsRequestBody,
  Pipelines,
  AttributeOption,
  NodeOption,
} from '../utils/types';
import DownloadResultButton from './DownloadResultButton';
import { sexes, modalities, subjectsURL } from '../utils/constants';

function ResultContainer({
  diagnosisOptions,
  assessmentOptions,
  response,
  datasetsRequestBody,
  availableNodes,
  IDToken,
}: {
  diagnosisOptions: AttributeOption[];
  assessmentOptions: AttributeOption[];
  response: DatasetsResponse | null;
  datasetsRequestBody: DatasetsRequestBody | null;
  availableNodes: NodeOption[];
  IDToken: string | undefined;
}) {
  const [download, setDownload] = useState<string[]>([]);
  const selectAll: boolean = response
    ? response.responses.length === download.length &&
      response.responses.every((r) => download.includes(r.dataset_uuid))
    : false;

  let numOfMatchedDatasets = 0;
  let numOfMatchedSubjects = 0;
  if (response) {
    response.responses.forEach((item) => {
      numOfMatchedDatasets += 1;
      numOfMatchedSubjects += item.num_matching_subjects;
    });
  }
  const summaryStats = `Summary stats: ${numOfMatchedDatasets} datasets, ${numOfMatchedSubjects} subjects`;

  /**
   * Updates the download array.
   *
   * @remarks
   * If the dataset uuid is not in the download array adds it, otherwise removes it.
   *
   * @param id - The uuid of the dataset to be added or removed from the download list
   * @returns void
   */
  const updateDownload = useCallback((id: string) => {
    setDownload((currDownload) => {
      const newDownload = !currDownload.includes(id)
        ? [...currDownload, id]
        : currDownload.filter((downloadID) => downloadID !== id);
      return newDownload;
    });
  }, []);

  function handleSelectAll(checked: boolean) {
    if (response) {
      const uuids = response.responses.map((item) => item.dataset_uuid);
      setDownload(checked ? uuids : []);
    }
  }

  useEffect(() => {
    if (response) {
      setDownload((currentDownload) =>
        currentDownload.filter((downloadID) =>
          response.responses.some((item) => item.dataset_uuid === downloadID)
        )
      );
    }
  }, [response]);

  function convertURIToLabel(
    type: string,
    uri: string | string[] | null
  ): string | string[] | null {
    // Handle array of URIs
    if (Array.isArray(uri)) {
      return uri.map((singleUri) => convertURIToLabel(type, singleUri)).join(',');
    }

    if (!uri) {
      return uri;
    }

    switch (type) {
      case 'sex': {
        const matchedSex = Object.entries(sexes).find(([, term_IRI]) => {
          const [, uniqueIdentifier] = term_IRI.split(':');
          return uri.includes(uniqueIdentifier);
        });
        // If a match is found, return the label, otherwise return the original URI
        return matchedSex ? matchedSex[0] : uri;
      }

      case 'sessionType':
        if (uri.includes('Imaging')) {
          return 'Imaging';
        }
        if (uri.includes('Phenotypic')) {
          return 'Phenotypic';
        }
        return uri;

      case 'diagnosis': {
        const diagnosis = diagnosisOptions.find((d) => {
          const [, id] = d.TermURL.split(':');
          return uri.includes(id);
        });
        return diagnosis ? diagnosis.Label : uri;
      }

      case 'assessment': {
        const assessment = assessmentOptions.find((a) => {
          const [, id] = a.TermURL.split(':');
          return uri.includes(id);
        });
        return assessment ? assessment.Label : uri;
      }

      case 'modality': {
        const modalityKey = Object.keys(modalities).find((key) => key === uri);
        return modalityKey ? modalities[modalityKey].label : uri;
      }

      case 'pipeline': {
        const segments = uri.split('/');
        return segments[segments.length - 1];
      }

      default:
        return uri;
    }
  }

  function parsePipelinesInfoToString(pipelines: Pipelines) {
    return pipelines
      ? Object.entries(pipelines)
          .flatMap(([name, versions]) =>
            (versions as string[]).map((version: string) => `${name} ${version}`)
          )
          .join(',')
      : '';
  }

  function generateTSVString(subjectsData: SubjectsResponse, buttonIndex: number) {
    const tsvRows = [];
    const isFileWithLabels = buttonIndex === 0;

    const headers = [
      'DatasetName',
      'PortalURI',
      'NumMatchingSubjects',
      'SubjectID',
      'SessionID',
      'ImagingSessionPath',
      'SessionType',
      'NumMatchingPhenotypicSessions',
      'NumMatchingImagingSessions',
      'Age',
      'Sex',
      'Diagnosis',
      'Assessment',
      'SessionImagingModalities',
      'SessionCompletedPipelines',
      'DatasetImagingModalities',
      'DatasetPipelines',
    ].join('\t');
    tsvRows.push(headers);

    subjectsData.responses.forEach((res) => {
      if (res.records_protected) {
        tsvRows.push(
          [
            res.dataset_name.replace(/\n/g, ' '),
            res.dataset_portal_uri,
            res.num_matching_subjects,
            'protected', // subject_id
            'protected', // session_id
            'protected', // session_file_path
            'protected', // session_type
            'protected', // num_matching_phenotypic_sessions
            'protected', // num_matching_imaging_sessions
            'protected', // age
            'protected', // sex
            'protected', // diagnosis
            'protected', // assessment
            'protected', // session_imaging_modality
            'protected', // session_completed_pipelines
            isFileWithLabels
              ? convertURIToLabel('modality', res.image_modals)
              : res.image_modals?.join(','),
            isFileWithLabels
              ? convertURIToLabel(
                  'pipeline',
                  parsePipelinesInfoToString(res.available_pipelines).split(',')
                )
              : parsePipelinesInfoToString(res.available_pipelines),
          ].join('\t')
        );
      } else {
        // @ts-expect-error: typescript doesn't know that subject_data is an array when records_protected is false.
        res.subject_data.forEach((subject) => {
          tsvRows.push(
            [
              res.dataset_name.replace(/\n/g, ' '),
              res.dataset_portal_uri,
              res.num_matching_subjects,
              subject.sub_id,
              subject.session_id,
              subject.session_file_path,
              isFileWithLabels
                ? convertURIToLabel('sessionType', subject.session_type)
                : subject.session_type,
              subject.num_matching_phenotypic_sessions,
              subject.num_matching_imaging_sessions,
              subject.age,
              isFileWithLabels ? convertURIToLabel('sex', subject.sex) : subject.sex,
              isFileWithLabels
                ? convertURIToLabel('diagnosis', subject.diagnosis)
                : subject.diagnosis,
              isFileWithLabels
                ? convertURIToLabel('assessment', subject.assessment)
                : subject.assessment,
              isFileWithLabels
                ? convertURIToLabel('modality', subject.image_modal)
                : subject.image_modal?.join(','),
              isFileWithLabels
                ? convertURIToLabel(
                    'pipeline',
                    parsePipelinesInfoToString(subject.completed_pipelines).split(',')
                  )
                : parsePipelinesInfoToString(subject.completed_pipelines),
              isFileWithLabels
                ? convertURIToLabel('modality', res.image_modals)
                : res.image_modals?.join(','),
              isFileWithLabels
                ? convertURIToLabel(
                    'pipeline',
                    parsePipelinesInfoToString(res.available_pipelines).split(',')
                  )
                : parsePipelinesInfoToString(res.available_pipelines),
            ].join('\t')
          );
        });
      }
    });
    return tsvRows.join('\n');
  }

  function constructSubjectsRequestBody(
    requestBody: DatasetsRequestBody,
    selectedDatasetUuids: string[],
    datasetResponses: DatasetsResponse['responses'],
    nodes: NodeOption[]
  ): SubjectsRequestBody {
    // Create a mapping from node_name to node_url (ApiURL)
    const nodeNameToUrlMap = new Map<string, string>();
    nodes.forEach((node) => {
      nodeNameToUrlMap.set(node.NodeName, node.ApiURL);
    });

    // Group selected datasets by their node_url (mapped from node_name)
    const nodeDatasetMap = new Map<string, string[]>();

    datasetResponses
      .filter((res) => selectedDatasetUuids.includes(res.dataset_uuid))
      .forEach((res) => {
        const nodeUrl = nodeNameToUrlMap.get(res.node_name);
        if (!nodeUrl) return;

        const datasets = nodeDatasetMap.get(nodeUrl) ?? [];
        datasets.push(res.dataset_uuid);
        nodeDatasetMap.set(nodeUrl, datasets);
      });

    return {
      ...requestBody,
      nodes: Array.from(nodeDatasetMap.entries()).map(([nodeUrl, datasetUuids]) => ({
        node_url: nodeUrl,
        dataset_uuids: datasetUuids,
      })),
    };
  }

  const action = (snackbarId: SnackbarKey) => (
    <IconButton
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      <CloseIcon className="text-white" />
    </IconButton>
  );

  async function downloadResults(buttonIndex: number) {
    if (!datasetsRequestBody || !response) return;

    try {
      const subjectsRequestBody = constructSubjectsRequestBody(
        datasetsRequestBody,
        download,
        response.responses,
        availableNodes
      );

      const subjectsResponse = await axios.post<SubjectsResponse>(
        subjectsURL,
        subjectsRequestBody,
        {
          headers: {
            Authorization: `Bearer ${IDToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const fileName =
        buttonIndex === 0
          ? 'neurobagel-query-results.tsv'
          : 'neurobagel-query-results-with-URIs.tsv';
      const element = document.createElement('a');
      const encodedTSV = encodeURIComponent(generateTSVString(subjectsResponse.data, buttonIndex));
      element.setAttribute('href', `data:text/tab-separated-values;charset=utf-8,${encodedTSV}`);
      element.setAttribute('download', fileName);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    } catch {
      enqueueSnackbar('Failed to download results.', {
        variant: 'error',
        action,
      });
    }
  }

  function renderResults() {
    if (response === null) {
      return (
        <Typography variant="h5" data-cy="default-result-container-view" className="text-gray-500">
          Click &apos;Submit Query&apos; for results
        </Typography>
      );
    }

    if (response.responses.length === 0) {
      return (
        <Typography variant="h5" data-cy="empty-result-container-view" className="text-gray-500">
          No results
        </Typography>
      );
    }

    return (
      <>
        <div className="flex flex-row items-baseline justify-between">
          <div>
            <FormControlLabel
              data-cy="select-all-checkbox"
              label="Select all datasets"
              control={
                <Checkbox
                  onChange={(event) => handleSelectAll(event.target.checked)}
                  checked={selectAll}
                />
              }
            />
          </div>
          <div>
            <Typography variant="body1" data-cy="summary-stats">
              {summaryStats}
            </Typography>
          </div>
        </div>
        <div className="h-[65vh] space-y-1 overflow-auto">
          {response.responses.map((item) => (
            <ResultCard
              key={item.dataset_uuid}
              nodeName={item.node_name}
              datasetUUID={item.dataset_uuid}
              datasetName={item.dataset_name}
              datasetPortalURI={item.dataset_portal_uri}
              datasetTotalSubjects={item.dataset_total_subjects}
              numMatchingSubjects={item.num_matching_subjects}
              imageModals={item.image_modals}
              pipelines={item.available_pipelines}
              checked={download.includes(item.dataset_uuid)}
              onCheckboxChange={updateDownload}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <DownloadResultButton
            disabled={download.length === 0}
            handleClick={(index) => downloadResults(index)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col" data-cy="result-container">
      {renderResults()}
    </div>
  );
}

export default ResultContainer;
