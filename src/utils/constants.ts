export const sexes: {[key: string]: string} = {
    male: 'snomed:248153007',
    female: 'snomed:248152002',
    other: 'snomed:32570681000036106',
};

export const modalities: {[key: string]: {label:string, TermURL: string, name: string, style: string}} = {
    'http://purl.org/nidash/nidm#ArterialSpinLabeling': {
        label: 'Arterial Spin Labeling',
        TermURL: 'nidm:ArterialSpinLabeling',
        name: 'ASL',
        style: 'bg-zinc-800 text-white',
    },
    'http://purl.org/nidash/nidm#DiffusionWeighted': {
        label: 'Diffusion Weighted',
        TermURL: 'nidm:DiffusionWeighted',
      name: 'DWI',
      style: 'bg-red-700 text-white',
    },
    'http://purl.org/nidash/nidm#EEG':
    {
        label: 'Electroencephalogram',
        TermURL: 'nidm:EEG',
      name: 'EEG',
      style: 'bg-rose-300 text-white',
    },
    'http://purl.org/nidash/nidm#FlowWeighted':
    {
        label: 'Flow Weighted',
        TermURL: 'nidm:FlowWeighted',
      name: 'Flow',
      style: 'bg-sky-700 text-white',
    },
    'http://purl.org/nidash/nidm#T1Weighted': {
        label: 'T1 Weighted',
        TermURL: 'nidm:T1Weighted',
      name: 'T1',
      style: 'bg-yellow-500 text-white',
    },
    'http://purl.org/nidash/nidm#T2Weighted': {
        label: 'T2 Weighted',
        TermURL: 'nidm:T2Weighted',
      name: 'T2',
      style: 'bg-green-600 text-white',
    },
  };