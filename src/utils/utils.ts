import axios from 'axios';
import { datasetsURL, subjectsURL } from './constants';
import {
  FieldInput,
  QueryFormState,
  QueryParams,
  DatasetsResponse,
  NodeOption,
  SubjectsRequestBody,
  SubjectsResponse,
  SubjectsQueryParams,
} from './types';

function normalizeFieldInput(input: FieldInput): string {
  if (input === null) {
    return 'null';
  }

  if (Array.isArray(input)) {
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
    areFieldInputsEqual(a.pipelineName, b.pipelineName) &&
    areFieldInputsEqual(a.pipelineVersion, b.pipelineVersion)
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
