export const unprotectedresponse1 = {
  erros: [],
  responses: [
    {
      node_name: 'some-node-name',
      dataset_uuid: 'http://neurobagel.org/vocab/0b9277fd-3d72-458f-9340-e468e67e5dc1',
      dataset_name: 'some-dataset',
      dataset_portal_uri: 'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git',
      dataset_total_subjects: 209,
      records_protected: false,
      num_matching_subjects: 2,
      subject_data: [
        {
          sub_id: 'sub-300100',
          session_id: 'ses-nb01',
          num_sessions: '1',
          age: '10.4',
          sex: 'http://purl.bioontology.org/ontology/SNOMEDCT/248152002',
          diagnosis: [null],
          subject_group: null,
          assessment: [null],
          image_modal: [
            'http://purl.org/nidash/nidm#FlowWeighted',
            'http://purl.org/nidash/nidm#T2Weighted',
          ],
          session_file_path: '/ds004116/sub-300100',
        },
        {
          sub_id: 'sub-300101',
          session_id: 'ses-nb01',
          num_sessions: '1',
          age: '10.4',
          sex: 'http://purl.bioontology.org/ontology/SNOMEDCT/248152002',
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
    },
  ],
  nodes_response_status: 'success',
};

export const protectedResponse1 = {
  errors: [],
  responses: [
    {
      node_name: 'some-node-name',
      dataset_uuid: 'http://neurobagel.org/vocab/cool-dataset',
      dataset_name: 'cool-dataset',
      dataset_portal_uri: 'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git',
      dataset_total_subjects: 10,
      records_protected: true,
      num_matching_subjects: 2,
      subject_data: 'protected',
      image_modals: [
        'http://purl.org/nidash/nidm#T1Weighted',
        'http://purl.org/nidash/nidm#T2Weighted',
      ],
    },
  ],
  nodes_response_status: 'success',
};

export const protectedResponse2 = {
  errors: [],
  responses: [
    {
      node_name: 'some-node-name',
      dataset_uuid: 'http://neurobagel.org/vocab/cool-dataset',
      dataset_name: 'cool-dataset',
      dataset_portal_uri: 'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git',
      dataset_total_subjects: 10,
      records_protected: true,
      num_matching_subjects: 2,
      subject_data: 'protected',
      image_modals: [
        'http://purl.org/nidash/nidm#T1Weighted',
        'http://purl.org/nidash/nidm#T2Weighted',
      ],
    },
    {
      node_name: 'another-node-name',
      dataset_uuid: 'http://neurobagel.org/vocab/not-so-cool-dataset',
      dataset_name: 'not-so-cool-dataset',
      dataset_portal_uri: 'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git',
      dataset_total_subjects: 11,
      records_protected: true,
      num_matching_subjects: 2,
      subject_data: 'protected',
      image_modals: [
        'http://purl.org/nidash/nidm#T2Weighted',
        'http://purl.org/nidash/nidm#FlowWeighted',
        'http://purl.org/nidash/nidm#T1Weighted',
      ],
    },
  ],
  nodes_response_status: 'success',
};

// Protected Response with a dataset name containing a newline
// character and a mix of protected and unprotected results
export const mixedResponse = {
  errors: [],
  responses: [
    {
      records_protected: true,
      dataset_uuid: 'https://someportal.org/datasets/ds0001',
      dataset_file_path: 'https://github.com/somethingDatasets/ds0001.git',
      dataset_name: 'some\ncool name',
      dataset_total_subjects: 10,
      num_matching_subjects: 3,
      subject_data: 'protected',
      image_modals: [
        'http://purl.org/nidash/nidm#FlowWeighted',
        'http://purl.org/nidash/nidm#T1Weighted',
      ],
    },
    {
      records_protected: false,
      dataset_uuid: 'https://someportal.org/datasets/ds0002',
      dataset_file_path: 'https://github.com/somethingDatasets/ds0002.git',
      dataset_name: 'some\nname',
      dataset_total_subjects: 11,
      num_matching_subjects: 5,
      subject_data: [
        {
          sub_id: 'sub-04',
          session_id: 'ses-nb04',
          num_sessions: '1',
          age: '35.0',
          sex: 'http://purl.bioontology.org/ontology/SNOMEDCT/248153007',
          diagnosis: [null, null, null],
          subject_group: null,
          assessment: [null],
          image_modal: [
            'http://purl.org/nidash/nidm#T2Weighted',
            'http://purl.org/nidash/nidm#T1Weighted',
            'http://purl.org/nidash/nidm#FlowWeighted',
          ],
          session_file_path: '/ds000011/sub-04',
        },
      ],
      image_modals: [
        'http://purl.org/nidash/nidm#FlowWeighted',
        'http://purl.org/nidash/nidm#T1Weighted',
      ],
    },
  ],
  nodes_response_status: 'success',
};

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

export const emptyDiagnosisOptions = {
  erros: [],
  responses: {
    'nb:Diagnosis': [],
  },
  nodes_response_status: 'success',
};

export const emptyAssessmentToolOptions = {
  errors: [],
  responses: {
    'nb:Assessment': [],
  },
  nodes_response_status: 'success',
};
