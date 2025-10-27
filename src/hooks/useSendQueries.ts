import axios from 'axios';
import { datasetsURL, subjectsURL } from '../utils/constants';
import {
  QueryParams,
  DatasetsResponse,
  NodeOption,
  SubjectsRequestBody,
  SubjectsResponse,
  SubjectsQueryParams,
} from '../utils/types';

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

export default function useSendQueries(IDToken: string | undefined) {
  async function runDatasetsQuery(datasetsRequestBody: QueryParams) {
    const response = await axios.post<DatasetsResponse>(datasetsURL, datasetsRequestBody, {
      headers: {
        ...(IDToken ? { Authorization: `Bearer ${IDToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async function runSubjectsQuery({
    queryParams,
    datasetSelection,
    datasetResponses,
    nodes,
  }: SubjectsQueryParams) {
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

  return { runDatasetsQuery, runSubjectsQuery };
}
