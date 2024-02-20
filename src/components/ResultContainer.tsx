import { useState, useEffect } from 'react';
import { Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import ResultCard from './ResultCard';
import { Result } from '../utils/types';
import DownloadResultButton from './DownloadResultButton';
import NBDialog from './NBDialog';

function ResultContainer({ result }: { result: Result[] | null }) {
  const [download, setDownload] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const selectAll: boolean = result
    ? result.length === download.length && result.every((r) => download.includes(r.dataset_uuid))
    : false;

  let numOfMatchedDatasets = 0;
  let numOfMatchedSubjects = 0;
  if (result) {
    result.forEach((item) => {
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
  function updateDownload(id: string) {
    setDownload((currDownload) => {
      const newDownload = !currDownload.includes(id)
        ? [...currDownload, id]
        : currDownload.filter((downloadID) => downloadID !== id);
      return newDownload;
    });
  }

  function handleSelectAll(checked: boolean) {
    if (result) {
      const uuids = result.map((item) => item.dataset_uuid);
      setDownload(checked ? uuids : []);
    }
  }

  useEffect(() => {
    if (result) {
      setDownload((currentDownload) =>
        currentDownload.filter((downloadID) =>
          result.some((item) => item.dataset_uuid === downloadID)
        )
      );
    }
  }, [result]);

  function generateTSVString(buttonIdentifier: string) {
    if (result) {
      const tsvRows = [];
      const datasets = result.filter((res) => download.includes(res.dataset_uuid));

      if (buttonIdentifier === 'participant-level') {
        const headers = [
          'DatasetID',
          'SubjectID',
          'Age',
          'Sex',
          'Diagnosis',
          'Assessment',
          'SessionID',
          'SessionPath',
          'NumSessions',
          'Modality',
        ].join('\t');
        tsvRows.push(headers);

        datasets.forEach((res) => {
          if (res.records_protected) {
            tsvRows.push(
              [
                res.dataset_uuid,
                'protected', // subject_id
                'protected', // age
                'protected', // sex
                'protected', // diagnosis
                'protected', // assessment
                'protected', // session_id
                'protected', // session_file_path
                'protected', // num_sessions
                'protected', // image_modal
              ].join('\t')
            );
          } else {
            // @ts-expect-error: typescript doesn't know that subject_data is an array when records_protected is false.
            res.subject_data.forEach((subject) => {
              tsvRows.push(
                [
                  res.dataset_uuid,
                  subject.sub_id,
                  subject.age,
                  subject.sex,
                  subject.diagnosis?.join(', '),
                  subject.assessment?.join(', '),
                  subject.session_id,
                  subject.session_file_path,
                  subject.num_sessions,
                  subject.image_modal?.join(', '),
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
    if (result === null) {
      return (
        <Typography variant="h5" data-cy="default-result-container-view" className="text-gray-500">
          Click &apos;Submit Query&apos; for results
        </Typography>
      );
    }
    if (result.length === 0) {
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
          <Typography variant="body1" data-cy="summary-stats">{summaryStats}</Typography>
        </div>
        <div className="col-span-4 max-h-96 space-y-2 overflow-auto">
          {result.map((item) => (
            <ResultCard
              key={item.dataset_uuid}
              nodeName={item.node_name}
              datasetUUID={item.dataset_uuid}
              datasetName={item.dataset_name}
              datasetTotalSubjects={item.dataset_total_subjects}
              numMatchingSubjects={item.num_matching_subjects}
              imageModals={item.image_modals}
              checked={download.includes(item.dataset_uuid)}
              onCheckboxChange={(id) => updateDownload(id)}
            />
          ))}
        </div>
        <div className="col-span-1">
          <Button variant="contained" data-cy="how-to-get-data-modal-button" onClick={() => setOpenModal(true)}>
            How to get data
          </Button>
          <NBDialog open={openModal} onClose={() => setOpenModal(false)} />
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
    <div className="grid grid-cols-4 grid-rows-2">
      <div className="col-span-4">
        <Typography variant="h5">Results</Typography>
      </div>
      {renderResults()}
    </div>
  );
}

export default ResultContainer;
