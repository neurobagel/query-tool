export const baseAPIURL: string = import.meta.env.NB_API_QUERY_URL.endsWith('/')
  ? import.meta.env.NB_API_QUERY_URL
  : `${import.meta.env.NB_API_QUERY_URL}/`;

export const queryURL: string = `${baseAPIURL}query?`;

export const nodesURL: string = `${baseAPIURL}nodes`;

export const appBasePath: string = import.meta.env.NB_QUERY_APP_BASE_PATH ?? '/';

export const enableAuth: boolean =
  import.meta.env.NB_ENABLE_AUTH === undefined
    ? false
    : import.meta.env.NB_ENABLE_AUTH.toLowerCase() === 'true';

export const enableChatbot: boolean =
  import.meta.env.NB_ENABLE_CHATBOT === undefined
    ? false
    : import.meta.env.NB_ENABLE_CHATBOT.toLowerCase() === 'true';

export const clientID: string = import.meta.env.NB_QUERY_CLIENT_ID ?? '';

export const sexes: { [key: string]: string } = {
  male: 'snomed:248153007',
  female: 'snomed:248152002',
  other: 'snomed:32570681000036106',
};

export const modalities: {
  [key: string]: { label: string; TermURL: string; name: string; bgColor: string };
} = {
  'http://purl.org/nidash/nidm#ArterialSpinLabeling': {
    label: 'Arterial Spin Labeling',
    TermURL: 'nidm:ArterialSpinLabeling',
    name: 'ASL',
    bgColor: 'bg-zinc-800',
  },
  'http://purl.org/nidash/nidm#DiffusionWeighted': {
    label: 'Diffusion Weighted',
    TermURL: 'nidm:DiffusionWeighted',
    name: 'DWI',
    bgColor: 'bg-red-700',
  },
  'http://purl.org/nidash/nidm#EEG': {
    label: 'Electroencephalogram',
    TermURL: 'nidm:EEG',
    name: 'EEG',
    bgColor: 'bg-rose-300',
  },
  'http://purl.org/nidash/nidm#FlowWeighted': {
    label: 'Flow Weighted',
    TermURL: 'nidm:FlowWeighted',
    name: 'Flow',
    bgColor: 'bg-sky-700',
  },
  'http://purl.org/nidash/nidm#T1Weighted': {
    label: 'T1 Weighted',
    TermURL: 'nidm:T1Weighted',
    name: 'T1',
    bgColor: 'bg-yellow-500',
  },
  'http://purl.org/nidash/nidm#T2Weighted': {
    label: 'T2 Weighted',
    TermURL: 'nidm:T2Weighted',
    name: 'T2',
    bgColor: 'bg-green-600',
  },
};
