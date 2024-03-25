export interface FieldInputOption {
  label: string;
  id: string;
}

export interface AttributeOption {
  Label: string;
  TermURL: string;
}

export interface NodeOption {
  NodeName: string;
  ApiURL: string;
}

export interface NodeError {
  node_name: string;
  error: string;
}

export interface RetrievedAttributeOption {
  responses: {
    [key: string]: AttributeOption[];
  };
  nodes_response_status: string;
  errors: NodeError[];
}

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
}

export interface Result {
  node_name: string;
  dataset_uuid: string;
  dataset_name: string;
  dataset_portal_uri: string;
  dataset_total_subjects: number;
  records_protected: boolean;
  num_matching_subjects: number;
  subject_data: Subject[] | string;
  image_modals: string[];
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
