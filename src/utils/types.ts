export interface FieldInputOption {
  label: string;
  id: string;
}

export interface AttributeOption {
  Label: string | null;
  TermURL: string;
}

export interface ImagingModalityOption extends AttributeOption {
  Abbreviation: string | null;
  DataType: string | null;
}

export interface ImagingModalitiesMetadata {
  [key: string]: ImagingModalityOption;
}

export interface NodeOption {
  NodeName: string;
  ApiURL: string;
}

export interface NodeError {
  node_name: string;
  error: string;
}

export interface BaseAPIResponse {
  nodes_response_status: string;
  errors: NodeError[];
}

export interface RetrievedAttributeOption extends BaseAPIResponse {
  responses: {
    [key: string]: AttributeOption[];
  };
}

export interface RetrievedPipelineVersions extends BaseAPIResponse {
  responses: {
    [key: string]: string[];
  };
}

export interface RetrievedImagingModalities extends BaseAPIResponse {
  responses: {
    [key: string]: ImagingModalityOption[];
  };
}

export interface AttributeResponse<T> {
  nodes_response_status: string;
  errors: { node_name: string; error: string }[];
  responses: Record<string, T[]>;
}

export interface Pipelines {
  [key: string]: string[];
}

export type QueryFormState = {
  nodes: string[];
  minAge: string;
  maxAge: string;
  sex: FieldInput;
  diagnosis: FieldInput;
  minNumImagingSessions: string;
  minNumPhenotypicSessions: string;
  assessmentTool: FieldInput;
  imagingModality: FieldInput;
  pipelineName: FieldInput;
  pipelineVersion: FieldInput;
};

export interface Subject {
  sub_id: string;
  session_id: string;
  num_sessions: string;
  age: string;
  sex: string;
  diagnosis: string[];
  subject_group: string;
  assessment: string[];
  image_modal: string[];
  session_file_path: string;
  completed_pipelines: Pipelines;
}

export interface SubjectsQueryParams {
  queryParams: QueryParams;
  datasetSelection: string[];
  datasetResponses: DatasetsResponse['responses'];
  nodes: NodeOption[];
}

export interface DatasetsResult {
  node_name: string;
  dataset_uuid: string;
  dataset_name: string;
  dataset_portal_uri: string;
  dataset_total_subjects: number;
  records_protected: boolean;
  num_matching_subjects: number;
  image_modals: string[];
  available_pipelines: Pipelines;
}

export interface SubjectsResult {
  dataset_uuid: string;
  dataset_name: string;
  dataset_portal_uri: string;
  dataset_total_subjects: number;
  records_protected: boolean;
  num_matching_subjects: number;
  image_modals: string[];
  available_pipelines: Pipelines;
  subject_data: Subject[] | string;
}

export interface DatasetsResponse extends BaseAPIResponse {
  responses: DatasetsResult[];
}

export interface SubjectsResponse extends BaseAPIResponse {
  responses: SubjectsResult[];
}

export interface QueryParams {
  min_age?: number;
  max_age?: number;
  sex?: string;
  diagnosis?: string;
  min_num_imaging_sessions?: number;
  min_num_phenotypic_sessions?: number;
  assessment?: string;
  image_modal?: string;
  pipeline_name?: string;
  pipeline_version?: string;
  nodes: Array<{ node_url: string }>;
}

export interface SubjectsRequestBody {
  min_age?: number;
  max_age?: number;
  sex?: string;
  diagnosis?: string;
  min_num_imaging_sessions?: number;
  min_num_phenotypic_sessions?: number;
  assessment?: string;
  image_modal?: string;
  pipeline_name?: string;
  pipeline_version?: string;
  nodes: Array<{ node_url: string; dataset_uuids: string[] }>;
}

export interface CategoricalFieldProps {
  label: string;
  options: FieldInputOption[];
  onFieldChange: (fieldLabel: string, value: FieldInput) => void;
  multiple?: boolean;
  inputValue: FieldInput;
  disabled?: boolean;
}

export type ToastProps = {
  key?: number | string;
  title?: string;
  message?: string;
  children?: React.ReactElement;
  duration?: number;
  severity?: 'success' | 'info' | 'warning' | 'error';
  position?: {
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'right' | 'center';
  };
  onClose?: () => void;
};

export type FieldInput = FieldInputOption | FieldInputOption[] | null;

export interface GoogleJWT {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name?: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

export type Notification = {
  id: string;
  type: 'info' | 'warning';
  message: string;
};
