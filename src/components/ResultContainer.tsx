import { useState, useEffect } from 'react';
import { Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ResultCard from './ResultCard';
import { Result } from '../utils/types';

function ResultContainer({ result }: { result: Result[] | null }) {
  const [downloads, setDownloads] = useState<string[]>([]);

  // TODO: deal with erros
  function updateDownloads(checked: boolean, id: string) {
    setDownloads((currDownloads) => {
      const newDownloads = checked
        ? [...currDownloads, id]
        : currDownloads.filter((download) => download !== id);
      return newDownloads;
    });
  }

  function selectAll() {
    if (result) {
      return (
        result.length === downloads.length &&
        result.every((r) => downloads.includes(r.dataset_uuid))
      );
    }
    return false;
  }

  function handleSelectAll(checked: boolean) {
    if (result) {
      if (checked) {
        setDownloads(result.map((item) => item.dataset_uuid));
      } else {
        setDownloads([]);
      }
    }
  }

  useEffect(() => {
    if (result) {
      setDownloads((currentDownloads) =>
        currentDownloads.filter((download) => result.some((item) => item.dataset_uuid === download))
      );
    }
  }, [result]);

  function renderResults() {
    if (result === null) {
      return (
        <Typography variant="h5" className="text-gray-500">
          Click &apos;Submit Query&apos; for results
        </Typography>
      );
    } if (result.length === 0) {
      return (
        <Typography variant="h5" className="text-gray-500">
          No results
        </Typography>
      );
    } 
      return (
        <>
          <div className="col-span-1 row-start-2">
            <FormControlLabel
              label="Select all datasets"
              control={
                <Checkbox
                  onChange={(event) => handleSelectAll(event.target.checked)}
                  checked={selectAll()}
                />
              }
            />
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
                checked={downloads.includes(item.dataset_uuid)}
                onCheckboxChange={(checked, id) => updateDownloads(checked, id)}
              />
            ))}
          </div>
          <div className="col-span-1">
            <Button variant="contained">How to get data</Button>
          </div>
          <div className="col-span-3 space-x-2 justify-self-end">
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Download dataset-level results
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Download dataset-level results
            </Button>
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
