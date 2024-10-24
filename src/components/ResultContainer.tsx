import { useState, useEffect, useCallback } from 'react';
import { Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import ResultCard from './ResultCard';
import { QueryResponse, Pipelines } from '../utils/types';
import DownloadResultButton from './DownloadResultButton';
import GetDataDialog from './GetDataDialog';

function ResultContainer({ response }: { response: QueryResponse | null }) {
  const [download, setDownload] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
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

  function parsePipelinesInfoToString(pipelines: Pipelines) {
    return pipelines
      ? Object.entries(pipelines)
          .flatMap(([name, versions]) =>
            (versions as string[]).map((version: string) => `${name} ${version}`)
          )
          .join(', ')
      : {};
  }

  function generateTSVString(buttonIdentifier: string) {
    if (response) {
      const tsvRows = [];
      const datasets = response.responses.filter((res) => download.includes(res.dataset_uuid));

      if (buttonIdentifier === 'participant-level') {
        const headers = [
          'DatasetID',
          'SubjectID',
          'SessionID',
          'SessionType',
          'Age',
          'Sex',
          'Diagnosis',
          'Assessment',
          'SessionFilePath',
          'NumPhenotypicSessions',
          'NumImagingSessions',
          'Modality',
          'CompletedPipelines',
        ].join('\t');
        tsvRows.push(headers);

        datasets.forEach((res) => {
          if (res.records_protected) {
            tsvRows.push(
              [
                res.dataset_uuid,
                'protected', // subject_id
                'protected', // session_id
                'protected', // session_type
                'protected', // age
                'protected', // sex
                'protected', // diagnosis
                'protected', // assessment
                'protected', // session_file_path
                'protected', // num_phenotypic_sessions
                'protected', // num_imaging_sessions
                'protected', // image_modal
                'protected', // completed_pipelines
              ].join('\t')
            );
          } else {
            // @ts-expect-error: typescript doesn't know that subject_data is an array when records_protected is false.
            res.subject_data.forEach((subject) => {
              tsvRows.push(
                [
                  res.dataset_uuid,
                  subject.sub_id,
                  subject.session_id,
                  subject.session_type,
                  subject.age,
                  subject.sex,
                  subject.diagnosis?.join(', '),
                  subject.assessment?.join(', '),
                  subject.session_file_path,
                  subject.num_matching_phenotypic_sessions,
                  subject.num_matching_imaging_sessions,
                  subject.image_modal?.join(', '),
                  parsePipelinesInfoToString(subject.completed_pipelines),
                ].join('\t')
              );
            });
          }
        });
      } else {
        const headers = [
          'DatasetID',
          'DatasetName',
          'PortalURI',
          'NumMatchingSubjects',
          'AvailableImageModalities',
          'AvailablePipelines',
        ].join('\t');
        tsvRows.push(headers);

        datasets.forEach((res) => {
          tsvRows.push(
            [
              res.dataset_uuid,
              res.dataset_name.replace('\n', ' '),
              res.dataset_portal_uri,
              res.num_matching_subjects,
              res.image_modals?.join(', '),
              parsePipelinesInfoToString(res.available_pipelines),
            ].join('\t')
          );
        });
      }

      return tsvRows.join('\n');
    }

    return '';
  }

  function downloadResults(buttonIdentifier: string) {
    const element = document.createElement('a');
    const encodedTSV = encodeURIComponent(generateTSVString(buttonIdentifier));
    element.setAttribute('href', `data:text/tab-separated-values;charset=utf-8,${encodedTSV}`);
    element.setAttribute('download', `${buttonIdentifier}-results.tsv`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }

  function renderResults() {
    if (response === null) {
      return (
        <Typography variant="h5" data-cy="default-result-container-view" className="text-gray-500">
          Click &apos;Submit Query&apos; for results
        </Typography>
      );
    }

    if (response.nodes_response_status === 'fail') {
      return (
        <div data-cy="failed-result-container-view">
          <Typography variant="h5">Query failed - no nodes responded!</Typography>
          <Typography className="text-gray-500">
            This is not supposed to happen. Please try again, or open an issue.
          </Typography>
        </div>
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
        <div className="col-end-5 justify-self-end">
          <Typography variant="body1" data-cy="summary-stats">
            {summaryStats}
          </Typography>
        </div>
        <div className="col-span-4 h-[70vh] space-y-2 overflow-auto">
          {response.responses.map((item) => (
            <ResultCard
              key={item.dataset_uuid}
              nodeName={item.node_name}
              datasetUUID={item.dataset_uuid}
              datasetName={item.dataset_name}
              datasetTotalSubjects={item.dataset_total_subjects}
              numMatchingSubjects={item.num_matching_subjects}
              imageModals={item.image_modals}
              pipelines={item.available_pipelines}
              checked={download.includes(item.dataset_uuid)}
              onCheckboxChange={updateDownload}
            />
          ))}
        </div>
        <div className="col-span-1">
          <Button
            variant="contained"
            data-cy="how-to-get-data-dialog-button"
            onClick={() => setOpenDialog(true)}
          >
            How to get data
          </Button>
          <GetDataDialog open={openDialog} onClose={() => setOpenDialog(false)} />
        </div>
        <div className="col-span-3 space-x-2 justify-self-end">
          <DownloadResultButton
            identifier="participant-level"
            disabled={download.length === 0}
            handleClick={(identifier) => downloadResults(identifier)}
          />
          <DownloadResultButton
            identifier="dataset-level"
            disabled={download.length === 0}
            handleClick={(identifier) => downloadResults(identifier)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-4 grid-rows-2" data-cy="result-container">
      <div className="col-span-4">
        <Typography variant="h5">Results</Typography>
      </div>
      {renderResults()}
    </div>
  );
}

export default ResultContainer;
