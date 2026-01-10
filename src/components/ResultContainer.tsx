import { useState, useEffect, useCallback } from 'react';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import ResultCard from './ResultCard';
import {
  DatasetsResponse,
  SubjectsResponse,
  QueryParams,
  Pipelines,
  AttributeOption,
  ImagingModalitiesMetadata,
} from '../utils/types';
import DownloadResultButton from './DownloadResultButton';
import { sexes } from '../utils/constants';
import ErrorAlert from './ErrorAlert';

type DownloadHandler = (buttonIndex: number, selection: string[]) => Promise<SubjectsResponse>;

function ResultContainer({
  diagnosisOptions,
  assessmentOptions,
  imagingModalitiesMetadata,
  datasetsResponse,
  queryForm,
  disableDownloads,
  onDownload,
}: {
  diagnosisOptions: AttributeOption[];
  assessmentOptions: AttributeOption[];
  imagingModalitiesMetadata: ImagingModalitiesMetadata;
  datasetsResponse: DatasetsResponse | null;
  queryForm: QueryParams | null;
  disableDownloads: boolean;
  onDownload: DownloadHandler;
}) {
  const [download, setDownload] = useState<string[]>([]);
  const selectAll: boolean = datasetsResponse
    ? datasetsResponse.responses.length === download.length &&
      datasetsResponse.responses.every((r) => download.includes(r.dataset_uuid))
    : false;

  let numOfMatchedDatasets = 0;
  let numOfMatchedSubjects = 0;
  if (datasetsResponse) {
    datasetsResponse.responses.forEach((item) => {
      numOfMatchedDatasets += 1;
      numOfMatchedSubjects += item.num_matching_subjects;
    });
  }
  const summaryStats = `Summary stats: ${numOfMatchedDatasets} datasets, ${numOfMatchedSubjects} subjects`;
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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
    if (datasetsResponse) {
      const uuids = datasetsResponse.responses.map((item) => item.dataset_uuid);
      setDownload(checked ? uuids : []);
    }
  }

  useEffect(() => {
    if (datasetsResponse) {
      setDownload((currentDownload) =>
        currentDownload.filter((downloadID) =>
          datasetsResponse.responses.some((item) => item.dataset_uuid === downloadID)
        )
      );
    }
  }, [datasetsResponse]);

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
        const modality = Object.values(imagingModalitiesMetadata).find((m) => {
          const [, id] = m.TermURL.split(':');
          return uri.includes(id);
        });
        return modality ? modality.Label : uri;
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

  function generateTSVString(subjectsResponse: SubjectsResponse, buttonIndex: number) {
    const tsvRows = [];
    const isFileWithLabels = buttonIndex === 0;

    const headers = [
      'DatasetName',
      'RepositoryURL',
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
      'AccessLink',
    ].join('\t');
    tsvRows.push(headers);

    subjectsResponse.responses.forEach((subResp) => {
      const datasetMetadata = datasetsResponse?.responses.find(
        (d) => d.dataset_uuid === subResp.dataset_uuid
      );

      // Fallback values if merge fails (should not happen if UUIDs match)
      const datasetName = datasetMetadata?.dataset_name ?? '';
      const repositoryUrl = datasetMetadata?.repository_url ?? '';
      const accessLink = datasetMetadata?.access_link ?? '';
      const numMatchingSubjects = datasetMetadata?.num_matching_subjects ?? 0;
      const isProtected = datasetMetadata?.records_protected ?? false;
      const datasetImageModals = datasetMetadata?.image_modals ?? [];
      const datasetPipelines = datasetMetadata?.available_pipelines ?? {};

      if (isProtected) {
        tsvRows.push(
          [
            datasetName.replace(/\n/g, ' '),
            repositoryUrl,
            numMatchingSubjects,
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
              ? convertURIToLabel('modality', datasetImageModals)
              : datasetImageModals?.join(','),
            isFileWithLabels
              ? convertURIToLabel(
                  'pipeline',
                  parsePipelinesInfoToString(datasetPipelines).split(',')
                )
              : parsePipelinesInfoToString(datasetPipelines),
            accessLink,
          ].join('\t')
        );
      } else {
        // @ts-expect-error: typescript doesn't know that subject_data is an array when records_protected is false.
        subResp.subject_data.forEach((subject) => {
          tsvRows.push(
            [
              datasetName.replace(/\n/g, ' '),
              repositoryUrl,
              numMatchingSubjects,
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
                ? convertURIToLabel('modality', datasetImageModals)
                : datasetImageModals?.join(','),
              isFileWithLabels
                ? convertURIToLabel(
                    'pipeline',
                    parsePipelinesInfoToString(datasetPipelines).split(',')
                  )
                : parsePipelinesInfoToString(datasetPipelines),
              accessLink,
            ].join('\t')
          );
        });
      }
    });
    return tsvRows.join('\n');
  }

  async function downloadResults(buttonIndex: number) {
    if (!queryForm || !datasetsResponse || loading) return;

    setLoading(true);

    try {
      const subjectsResponse = await onDownload(buttonIndex, download);
      setDownloadError(null);
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

      const fileName =
        buttonIndex === 0
          ? `neurobagel-query-results_${timestamp}.tsv`
          : `neurobagel-query-results-with-URIs_${timestamp}.tsv`;
      const element = document.createElement('a');
      const encodedTSV = encodeURIComponent(generateTSVString(subjectsResponse, buttonIndex));
      element.setAttribute('href', `data:text/tab-separated-values;charset=utf-8,${encodedTSV}`);
      element.setAttribute('download', fileName);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    } catch {
      setDownloadError('We were unable to download the selected query results. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function renderResults() {
    if (datasetsResponse === null) {
      return (
        <Typography variant="h5" data-cy="default-result-container-view" className="text-gray-500">
          Click &apos;Submit Query&apos; for results
        </Typography>
      );
    }

    if (datasetsResponse.responses.length === 0) {
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
          {datasetsResponse.responses.map((item) => (
            <ResultCard
              key={item.dataset_uuid}
              nodeName={item.node_name}
              datasetUuid={item.dataset_uuid}
              datasetName={item.dataset_name}
              authors={item.authors}
              homepage={item.homepage}
              referencesAndLinks={item.references_and_links}
              keywords={item.keywords}
              repositoryUrl={item.repository_url}
              accessInstructions={item.access_instructions}
              accessType={item.access_type}
              accessEmail={item.access_email}
              accessLink={item.access_link}
              datasetTotalSubjects={item.dataset_total_subjects}
              recordsProtected={item.records_protected}
              numMatchingSubjects={item.num_matching_subjects}
              imageModals={item.image_modals}
              availablePipelines={item.available_pipelines}
              imagingModalitiesMetadata={imagingModalitiesMetadata}
              checked={download.includes(item.dataset_uuid)}
              onCheckboxChange={updateDownload}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <DownloadResultButton
            disabled={download.length === 0 || disableDownloads || !queryForm}
            handleClick={(index) => downloadResults(index)}
            loading={loading}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col" data-cy="result-container">
      {downloadError && (
        <div className="mb-2">
          <ErrorAlert
            errorTitle="Download failed"
            errorExplanation="We couldn't download the selected results. Try running the download again."
            severity="error"
          />
        </div>
      )}
      {renderResults()}
    </div>
  );
}

export default ResultContainer;
