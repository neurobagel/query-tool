const { NB_API_QUERY_URL } = import.meta.env;

export const baseAPIURL: string = NB_API_QUERY_URL.endsWith('/')
  ? NB_API_QUERY_URL
  : `${NB_API_QUERY_URL}/`;

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
    bgColor: 'rgb(113, 113, 122)',
  },
  'http://purl.org/nidash/nidm#DiffusionWeighted': {
    label: 'Diffusion Weighted',
    TermURL: 'nidm:DiffusionWeighted',
    name: 'DWI',
    bgColor: 'rgb(205, 92, 92)',
  },
  'http://purl.org/nidash/nidm#Electroencephalography': {
    label: 'Electroencephalogram',
    TermURL: 'nidm:Electroencephalography',
    name: 'EEG',
    bgColor: 'rgb(253, 164, 164)',
  },
  'http://purl.org/nidash/nidm#FlowWeighted': {
    label: 'Functional MRI',
    TermURL: 'nidm:FlowWeighted',
    name: 'fMRI',
    bgColor: 'rgb(70, 130, 180)',
  },
  'http://purl.org/nidash/nidm#T1Weighted': {
    label: 'T1 Weighted',
    TermURL: 'nidm:T1Weighted',
    name: 'T1',
    bgColor: 'rgb(189, 183, 107)',
  },
  'http://purl.org/nidash/nidm#T2Weighted': {
    label: 'T2 Weighted',
    TermURL: 'nidm:T2Weighted',
    name: 'T2',
    bgColor: 'rgb(143, 188, 143)',
  },
  'http://purl.org/nidash/nidm#Magnetoencephalography': {
    label: 'Magnetoencephalography',
    TermURL: 'nidm:Magnetoencephalography',
    name: 'MEG',
    bgColor: 'rgb(215,145,50)',
  },
  'http://purl.org/nidash/nidm#PositronEmissionTomography': {
    label: 'Positron Emission Tomography',
    TermURL: 'nidm:PositronEmissionTomography',
    name: 'PET',
    bgColor: 'rgb(78,20,186)',
  },
};
