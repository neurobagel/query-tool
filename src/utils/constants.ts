const { NB_API_QUERY_URL } = import.meta.env;

export const baseAPIURL: string = NB_API_QUERY_URL.endsWith('/')
  ? NB_API_QUERY_URL
  : `${NB_API_QUERY_URL}/`;

export const datasetsURL: string = `${baseAPIURL}datasets`;

export const subjectsURL: string = `${baseAPIURL}subjects`;

export const nodesURL: string = `${baseAPIURL}nodes`;

export const appBasePath: string = import.meta.env.NB_QUERY_APP_BASE_PATH ?? '/';

export const enableAuth: boolean =
  import.meta.env.NB_ENABLE_AUTH === undefined
    ? false
    : import.meta.env.NB_ENABLE_AUTH.toLowerCase() === 'true';



export const clientID: string = import.meta.env.NB_QUERY_CLIENT_ID ?? '';

export const sexes: { [key: string]: string } = {
  male: 'snomed:248153007',
  female: 'snomed:248152002',
  other: 'snomed:32570681000036106',
};

// We do not support "beh" and "phenotype" BIDS tags
export const modalitiesDataTypeColorMapping: { [key: string]: string } = {
  anat: 'rgba(0, 150, 136, 1)',
  dwi: 'rgb(253, 164, 164)',
  eeg: 'rgb(70, 130, 180)',
  fmap: 'rgb(189, 183, 107)',
  func: 'rgb(143, 188, 143)',
  ieeg: 'rgb(215,145,50)',
  meg: 'rgb(78,20,186)',
  micr: 'rgba(0, 192, 6, 0.54)',
  motion: 'rgb(199, 21, 133)',
  mrs: 'rgb(0, 191, 255)',
  perf: 'rgb(34, 139, 34)',
  pet: 'rgb(255, 69, 0)',
  nirs: 'rgba(228, 104, 170, 1)',
};
