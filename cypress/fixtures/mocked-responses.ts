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
  available_pipelines: {
    'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/fmriprep': ['23.1.3'],
    'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/freesurfer': ['7.3.2'],
  },
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
      num_matching_imaging_sessions: '0',
      session_type: 'http://neurobagel.org/vocab/PhenotypicSession',
      age: '10.4',
      sex: 'http://purl.bioontology.org/ontology/SNOMEDCT/248152002',
      diagnosis: ['http://purl.bioontology.org/ontology/SNOMEDCT/370143000'],
      subject_group: null,
      assessment: ['https://www.cognitiveatlas.org/task/id/trm_4f2419c4a1646'],
      image_modal: [null],
      session_file_path: null,
      completed_pipelines: {},
    },
    {
      sub_id: 'sub-300101',
      session_id: 'ses-nb01',
      num_matching_phenotypic_sessions: '0',
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
      completed_pipelines: {
        'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/fmriprep': ['23.1.3'],
        'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/freesurfer': ['7.3.2'],
      },
    },
  ],
  image_modals: [
    'http://purl.org/nidash/nidm#T2Weighted',
    'http://purl.org/nidash/nidm#FlowWeighted',
  ],
  available_pipelines: {
    'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/fmriprep': ['23.1.3'],
    'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/freesurfer': ['7.3.2'],
  },
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
  nodes_response_status: 'fail',
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
      {
        TermURL: 'snomed:370143000',
        Label: 'Major depressive disorder',
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
  nodes_response_status: 'fail',
  errors: [
    {
      node_name: 'NoDiagnosisNode',
      error: 'some error message',
    },
  ],
};

// Real example of a bad response where some attributes
// did not have labels in the federated nodes
export const badDiagnosisOptions = {
  errors: [
    {
      node_name: 'International Neuroimaging Data-sharing Initiative',
      error:
        'Bad Gateway: <html>\r\n<head><title>502 Bad Gateway</title></head>\r\n<body>\r\n<center><h1>502 Bad Gateway</h1></center>\r\n<hr><center>nginx/1.18.0 (Ubuntu)</center>\r\n</body>\r\n</html>\r\n',
    },
  ],
  responses: {
    'nb:Diagnosis': [
      {
        TermURL: 'snomed:49049000',
        Label: "Parkinson's disease",
      },
      {
        TermURL: 'snomed:77176002',
        Label: null,
      },
      {
        TermURL: 'snomed:197480006',
        Label: 'Anxiety disorder',
      },
      {
        TermURL: 'snomed:37796009',
        Label: null,
      },
      {
        TermURL: 'snomed:82838007',
        Label: null,
      },
    ],
  },
  nodes_response_status: 'partial success',
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
      {
        TermURL: 'cogatlas:trm_4f2419c4a1646',
        Label: 'multisource interference task',
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
  nodes_response_status: 'fail',
  errors: [
    {
      node_name: 'NoAssessmentNode',
      error: 'some error message',
    },
  ],
};

export const pipelineOptions = {
  errors: [],
  responses: {
    'nb:Pipeline': [
      {
        TermURL: 'np:fmriprep',
        Label: 'fmriprep',
      },
      {
        TermURL: 'np:freesurfer',
        Label: 'freesurfer',
      },
    ],
  },
  nodes_response_status: 'success',
};

export const emptyPipelineOPtions = { ...pipelineOptions, responses: { 'nb:Pipeline': [] } };

export const partiallyFailedPipelineOptions = {
  ...pipelineOptions,
  nodes_response_status: 'partial success',
  errors: [
    {
      node_name: 'NoPipelineNode',
      error: 'some error message',
    },
  ],
};

export const failedPipelineOptions = {
  ...emptyPipelineOPtions,
  nodes_response_status: 'fail',
  errors: [
    {
      node_name: 'NoPipelineNode',
      error: 'some error message',
    },
  ],
};

export const pipelineVersionOptions = {
  errors: [],
  responses: {
    'np:fmriprep': ['0.2.3', '23.1.3'],
  },
  nodes_response_status: 'success',
};

export const emptyPipelineVersionOptions = {
  ...pipelineVersionOptions,
  responses: { 'np:fmriprep': [] },
};

export const partiallyFailedPipelineVersionOptions = {
  ...pipelineVersionOptions,
  nodes_response_status: 'partial success',
  errors: [
    {
      node_name: 'NoPipelineVersionNode',
      error: 'some error message',
    },
  ],
};

export const failedPipelineVersionOptions = {
  ...emptyPipelineVersionOptions,
  nodes_response_status: 'fail',
  errors: [
    {
      node_name: 'NoPipelineVersionNode',
      error: 'some error message',
    },
  ],
};
