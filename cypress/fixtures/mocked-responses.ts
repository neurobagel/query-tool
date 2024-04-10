// TODO: rename mocked responses to something more descriptive

// QUERY RESPONSES
const protectedDatasetSnippet = {
  node_name: 'some-node-name',
  dataset_portal_uri: 'https://hello.dataset.portal',
  records_protected: true,
  dataset_uuid: 'https://someportal.org/datasets/ds0001',
  dataset_file_path: 'https://github.com/somethingDatasets/ds0001.git',
  dataset_name: 'some\ncool name',
  dataset_total_subjects: 10,
  num_matching_subjects: 2,
  subject_data: 'protected',
  image_modals: [
    'http://purl.org/nidash/nidm#FlowWeighted',
    'http://purl.org/nidash/nidm#T1Weighted',
  ],
};

const unprotectedDatasetSnippet = {
  records_protected: false,
  node_name: 'some-node-name',
  dataset_uuid: 'http://neurobagel.org/vocab/1234',
  dataset_name: 'some\ndataset',
  dataset_portal_uri: 'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git',
  dataset_total_subjects: 209,
  num_matching_subjects: 2,
  subject_data: [
    {
      sub_id: 'sub-300100',
      session_id: 'ses-nb01',
      num_matching_phenotypic_sessions: '1',
      num_matching_imaging_sessions: '1',
      session_type: 'http://neurobagel.org/vocab/PhenotypicSession',
      age: '10.4',
      sex: 'http://purl.bioontology.org/ontology/SNOMEDCT/248152002',
      diagnosis: ['http://purl.bioontology.org/ontology/SNOMEDCT/370143000'],
      subject_group: null,
      assessment: ['https://www.cognitiveatlas.org/task/id/trm_4f2419c4a1646'],
      image_modal: [null],
      session_file_path: null,
    },
    {
      sub_id: 'sub-300101',
      session_id: 'ses-nb01',
      num_matching_phenotypic_sessions: '1',
      num_matching_imaging_sessions: '1',
      session_type: 'http://neurobagel.org/vocab/ImagingSession',
      age: null,
      sex: null,
      diagnosis: [null],
      subject_group: null,
      assessment: [null],
      image_modal: [
        'http://purl.org/nidash/nidm#FlowWeighted',
        'http://purl.org/nidash/nidm#T2Weighted',
      ],
      session_file_path: '/ds004116/sub-300101',
    },
  ],
  image_modals: [
    'http://purl.org/nidash/nidm#T2Weighted',
    'http://purl.org/nidash/nidm#FlowWeighted',
  ],
};

// doesn't care
export const protectedResponse1 = {
  errors: [],
  responses: [protectedDatasetSnippet],
  nodes_response_status: 'success',
};

// Needs 2 datasets with 4 total matching subjects
export const protectedResponse2 = {
  errors: [],
  responses: [
    protectedDatasetSnippet,
    { ...protectedDatasetSnippet, dataset_uuid: 'https://someportal.org/datasets/ds0002' },
  ],
  nodes_response_status: 'success',
};

export const unprotectedResponse = {
  errors: [],
  responses: [unprotectedDatasetSnippet],
  nodes_response_status: 'success',
};

// Protected Response with a dataset name containing a newline
// character and a mix of protected and unprotected results
export const mixedResponse = {
  errors: [],
  responses: [protectedDatasetSnippet, unprotectedDatasetSnippet],
  nodes_response_status: 'success',
};

export const partialSuccessMixedResponse = {
  ...mixedResponse,
  nodes_response_status: 'partial success',
  errors: [
    {
      node_name: 'DidNotWorkNode',
      error: 'some error message',
    },
  ],
}; // Partial Success

export const failedQueryResponse = {
  responses: [],
  nodes_response_status: 'failure',
  errors: [
    {
      node_name: 'DidNotWorkNode',
      error: 'some error message',
    },
  ],
};

// ATTRIBUTE RESPONSES
export const nodeOptions = [
  {
    NodeName: 'OpenNeuro',
    ApiURL: 'https://someurl/',
  },
  {
    NodeName: 'Quebec Parkinson Network',
    ApiURL: 'http://anotherurl/',
  },
];

export const diagnosisOptions = {
  errors: [],
  responses: {
    'nb:Diagnosis': [
      {
        TermURL: 'snomed:49049000',
        Label: "Parkinson's disease",
      },
      {
        TermURL: 'snomed:127295002',
        Label: 'Traumatic brain injury',
      },
    ],
  },
  nodes_response_status: 'success',
};
export const emptyDiagnosisOptions = { ...diagnosisOptions, responses: { 'nb:Diagnosis': [] } };

export const partiallyFailedDiagnosisToolOptions = {
  ...diagnosisOptions,
  nodes_response_status: 'partial success',
  errors: [
    {
      node_name: 'NoDiagnosisNode',
      error: 'some error message',
    },
  ],
};

export const failedDiagnosisToolOptions = {
  ...emptyDiagnosisOptions,
  nodes_response_status: 'failure',
  errors: [
    {
      node_name: 'NoDiagnosisNode',
      error: 'some error message',
    },
  ],
};

export const assessmentToolOptions = {
  errors: [],
  responses: {
    'nb:Assessment': [
      {
        TermURL: 'cogatlas:trm_4d559bcd67c18',
        Label: 'balloon analogue risk task',
      },
      {
        TermURL: 'cogatlas:tsk_4a57abb949e1a',
        Label: 'stop signal task',
      },
    ],
  },
  nodes_response_status: 'success',
};

export const emptyAssessmentToolOptions = {
  ...assessmentToolOptions,
  responses: { 'nb:Assessment': [] },
};

export const partiallyFailedAssessmentToolOptions = {
  ...assessmentToolOptions,
  nodes_response_status: 'partial success',
  errors: [
    {
      node_name: 'NoAssessmentNode',
      error: 'some error message',
    },
  ],
};

export const failedAssessmentToolOptions = {
  ...emptyAssessmentToolOptions,
  nodes_response_status: 'failure',
  errors: [
    {
      node_name: 'NoAssessmentNode',
      error: 'some error message',
    },
  ],
};
