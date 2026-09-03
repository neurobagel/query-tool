import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { Pipelines } from '../utils/types';
import CollapsiblePipelineGroup from './CollapsiblePipelineGroup';

export interface PipelineOption {
  pipelineId: string;
  pipelineLabel: string;
  version?: string;
}

export interface PipelineFieldProps {
  pipelines: Pipelines;
  value: PipelineOption[];
  onFieldChange: (selectedPipelines: PipelineOption[]) => void;
  disabled?: boolean;
}

function buildPipelineOptions(pipelines: Pipelines): PipelineOption[] {
  return Object.keys(pipelines).flatMap((pId) => {
    const pLabel = pId.startsWith('np:') ? pId.slice(3) : pId;
    const versions = pipelines[pId] ?? [];
    if (versions.length === 0) {
      return [{ pipelineId: pId, pipelineLabel: pLabel }];
    }
    return versions.map((v) => ({
      pipelineId: pId,
      pipelineLabel: pLabel,
      version: v,
    }));
  });
}

function PipelineField({ pipelines, value, onFieldChange, disabled = false }: PipelineFieldProps) {
  const options = buildPipelineOptions(pipelines);

  const handleTogglePipeline = (pId: string, pLabel: string) => {
    const isHeaderChecked = value.some((opt) => opt.pipelineId === pId && !opt.version);

    let updatedValue: PipelineOption[];
    if (isHeaderChecked) {
      // Uncheck parent: remove this pipeline and any versions
      updatedValue = value.filter((opt) => opt.pipelineId !== pId);
    } else {
      // Check parent: clear any specific versions for this pipeline and add the pipeline-level option
      const filtered = value.filter((opt) => opt.pipelineId !== pId);
      updatedValue = [...filtered, { pipelineId: pId, pipelineLabel: pLabel }];
    }

    onFieldChange(updatedValue);
  };

  const handleAutocompleteChange = (_: unknown, newOptions: PipelineOption[]) => {
    // If a specific version was selected, remove any "any version" entry for that pipeline
    const pipelinesWithSpecificVersions = new Set(
      newOptions.filter((opt) => opt.version != null).map((opt) => opt.pipelineId)
    );

    const filteredOptions = newOptions.filter(
      (opt) => opt.version != null || !pipelinesWithSpecificVersions.has(opt.pipelineId)
    );

    onFieldChange(filteredOptions);
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      data-cy="Pipeline name and version-categorical-field"
      options={options}
      value={value}
      isOptionEqualToValue={(option, val) =>
        option.pipelineId === val.pipelineId && option.version === val.version
      }
      getOptionLabel={(option) =>
        option.version
          ? `${option.pipelineLabel} ${option.version}`
          : `${option.pipelineLabel} any version`
      }
      groupBy={(option) => option.pipelineLabel}
      renderGroup={({ key, group, children }) => {
        const pId =
          Object.keys(pipelines).find(
            (id) => (id.startsWith('np:') ? id.slice(3) : id) === group
          ) ?? `np:${group}`;
        const isPipelineChecked = value.some((opt) => opt.pipelineId === pId && !opt.version);

        return (
          <CollapsiblePipelineGroup
            key={key}
            groupKey={key}
            groupLabel={group}
            pipelineId={pId}
            isPipelineChecked={isPipelineChecked}
            onTogglePipeline={handleTogglePipeline}
          >
            {children}
          </CollapsiblePipelineGroup>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Pipeline name and version" placeholder="Select an option" />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={`${option.pipelineId}-${option.version}`}>
          <Checkbox size="small" sx={{ mr: 1 }} checked={selected} />
          {option.version
            ? `${option.pipelineLabel} ${option.version}`
            : `${option.pipelineLabel} any version`}
        </li>
      )}
      onChange={handleAutocompleteChange}
      disabled={disabled}
    />
  );
}

export default PipelineField;
