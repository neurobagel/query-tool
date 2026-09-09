import axios from 'axios';
import { datasetsURL, subjectsURL } from './constants';
import {
  FieldInput,
  FieldInputOption,
  HierarchicalOption,
  PipelineOption,
  Pipelines,
  QueryFormState,
  QueryParams,
  DatasetsResponse,
  NodeOption,
  SubjectsRequestBody,
  SubjectsResponse,
  SubjectsQueryParams,
} from './types';

/**
 * Normalizes a FieldInput (null, single option, or array) into an array of options.
 * Accepts an optional generic T to preserve specific option subtypes.
 */
export function normalizeFieldInputOptions<T extends FieldInputOption = FieldInputOption>(
  input: FieldInput
): T[] {
  if (input === null) {
    return [];
  }
  return (Array.isArray(input) ? input : [input]) as T[];
}

export function validateContinuousValue(rawValue: string, parsedValue: number | null): string {
  const trimmed = rawValue.trim();
  if (trimmed === '') {
    return '';
  }
  if (parsedValue === null) {
    return 'Please enter a valid number!';
  }
  if (parsedValue < 0) {
    return 'Please enter a positive number!';
  }
  return '';
}

export function getPipelineLabel(pId: string): string {
  return pId.startsWith('np:') ? pId.slice(3) : pId;
}

export function buildPipelineOptions(pipelines: Pipelines): HierarchicalOption[] {
  return Object.keys(pipelines).flatMap((pId): HierarchicalOption[] => {
    const pLabel = getPipelineLabel(pId);
    const versions = pipelines[pId] ?? [];
    if (versions.length === 0) {
      return [
        {
          id: pId,
          label: `${pLabel} any version`,
          parentId: pId,
          parentLabel: pLabel,
          isTopLevel: true,
        },
      ];
    }
    return versions.map((v) => ({
      id: `${pId}::${v}`,
      label: `${pLabel} ${v}`,
      parentId: pId,
      parentLabel: pLabel,
      isTopLevel: false,
    }));
  });
}

export function pipelineOptionsToHierarchical(selected: PipelineOption[]): HierarchicalOption[] {
  return selected.map((p) => {
    if (p.version) {
      return {
        id: `${p.pipelineId}::${p.version}`,
        label: `${p.pipelineLabel} ${p.version}`,
        parentId: p.pipelineId,
        parentLabel: p.pipelineLabel,
        isTopLevel: false,
      };
    }
    return {
      id: p.pipelineId,
      label: `${p.pipelineLabel} any version`,
      parentId: p.pipelineId,
      parentLabel: p.pipelineLabel,
      isTopLevel: true,
    };
  });
}

export function hierarchicalToPipelineOptions(selected: HierarchicalOption[]): PipelineOption[] {
  return selected.map((opt) => {
    if (opt.isTopLevel) {
      return {
        pipelineId: opt.parentId,
        pipelineLabel: opt.parentLabel,
      };
    }
    const version = opt.id.includes('::') ? opt.id.split('::')[1] : undefined;
    return {
      pipelineId: opt.parentId,
      pipelineLabel: opt.parentLabel,
      ...(version ? { version } : {}),
    };
  });
}

function normalizeFieldInput(input: FieldInput): string {
  if (input === null) {
    return 'null';
  }

  if (Array.isArray(input)) {
    if (input.length === 0) {
      return 'null';
    }
    const ids = input.map((option) => option.id).sort();
    return `multi:${ids.join('|')}`;
  }

  return `single:${input.id}`;
}

function areFieldInputsEqual(a: FieldInput, b: FieldInput): boolean {
  return normalizeFieldInput(a) === normalizeFieldInput(b);
}

function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}

function arePipelineOptionsEqual(a: PipelineOption[], b: PipelineOption[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const serialize = (opt: PipelineOption) => `${opt.pipelineId}::${opt.version ?? ''}`;
  const sortedA = [...a].map(serialize).sort();
  const sortedB = [...b].map(serialize).sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}

export function parseNumericValue(value: string): number | null {
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return null;
  }

  const parsed = Number(trimmedValue);
  return Number.isNaN(parsed) ? null : parsed;
}

export default function areFormStatesEqual(a: QueryFormState, b: QueryFormState): boolean {
  return (
    areStringArraysEqual(a.nodes, b.nodes) &&
    a.minAge === b.minAge &&
    a.maxAge === b.maxAge &&
    areFieldInputsEqual(a.sex, b.sex) &&
    areFieldInputsEqual(a.diagnosis, b.diagnosis) &&
    a.minNumImagingSessions === b.minNumImagingSessions &&
    a.minNumPhenotypicSessions === b.minNumPhenotypicSessions &&
    areFieldInputsEqual(a.assessmentTool, b.assessmentTool) &&
    areFieldInputsEqual(a.imagingModality, b.imagingModality) &&
    arePipelineOptionsEqual(a.selectedPipelines, b.selectedPipelines)
  );
}

function buildSubjectsRequestBody(
  queryForm: QueryParams,
  datasetSelection: string[],
  datasetResponses: DatasetsResponse['responses'],
  nodes: NodeOption[]
): SubjectsRequestBody {
  const nodeNameToUrl = new Map(nodes.map((node) => [node.NodeName, node.ApiURL]));
  const nodeDatasets = new Map<string, string[]>();

  datasetResponses
    .filter((res) => datasetSelection.includes(res.dataset_uuid))
    .forEach((res) => {
      const nodeUrl = nodeNameToUrl.get(res.node_name);
      if (!nodeUrl) {
        return;
      }

      const datasets = nodeDatasets.get(nodeUrl) ?? [];
      datasets.push(res.dataset_uuid);
      nodeDatasets.set(nodeUrl, datasets);
    });

  return {
    ...queryForm,
    nodes: Array.from(nodeDatasets.entries()).map(([nodeUrl, datasetUuids]) => ({
      node_url: nodeUrl,
      dataset_uuids: datasetUuids,
    })),
  };
}

export async function sendDatasetsQuery(
  datasetsRequestBody: QueryParams,
  IDToken?: string
): Promise<DatasetsResponse> {
  const response = await axios.post<DatasetsResponse>(datasetsURL, datasetsRequestBody, {
    headers: {
      ...(IDToken ? { Authorization: `Bearer ${IDToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function sendSubjectsQuery(
  { queryParams, datasetSelection, datasetResponses, nodes }: SubjectsQueryParams,
  IDToken?: string
): Promise<SubjectsResponse> {
  const subjectsRequestBody = buildSubjectsRequestBody(
    queryParams,
    datasetSelection,
    datasetResponses,
    nodes
  );

  const response = await axios.post<SubjectsResponse>(subjectsURL, subjectsRequestBody, {
    headers: {
      ...(IDToken ? { Authorization: `Bearer ${IDToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}
