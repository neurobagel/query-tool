import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { isFederationAPI, sexes, modalities } from '../utils/constants';
import { FieldInput, FieldInputOption, NodeOption, AttributeOption } from '../utils/types';
import CategoricalField from './CategoricalField';
import ContinuousField from './ContinuousField';

function QueryForm({
  nodeOptions,
  diagnosisOptions,
  assessmentOptions,
  apiQueryURL,
  loading,
  onSubmitQuery,
}: {
  nodeOptions: NodeOption[];
  diagnosisOptions: AttributeOption[];
  assessmentOptions: AttributeOption[];
  apiQueryURL: string;
  loading: boolean;
  onSubmitQuery: (url: string) => void;
}) {
  const [node, setNode] = useState<FieldInput>([{ label: 'All', id: 'allNodes' }]);
  const [minAge, setMinAge] = useState<string | null>(null);
  const [maxAge, setMaxAge] = useState<string | null>(null);
  const [sex, setSex] = useState<FieldInput>(null);
  const [diagnosis, setDiagnosis] = useState<FieldInput>(null);
  const [isControl, setIsControl] = useState<boolean>(false);
  const [minNumSessions, setMinNumSessions] = useState<string | null>(null);
  const [assessmentTool, setAssessmentTool] = useState<FieldInput>(null);
  const [imagingModality, setImagingModality] = useState<FieldInput>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (nodeOptions.length > 1) {
      const searchParamNodes: string[] = searchParams.getAll('node');
      if (searchParamNodes) {
        const matchedOptions: FieldInputOption[] = searchParamNodes
          .map((label) => {
            const foundOption = nodeOptions.find((option) => option.NodeName === label);
            return foundOption ? { label, id: foundOption.ApiURL } : { label, id: '' };
          })
          .filter((option) => option.id !== '');
        // If there is no node in the search params, set it to All
        if (matchedOptions.length === 0) {
          setSearchParams({ node: ['All'] });
          setNode([{ label: 'All', id: 'allNodes' }]);
        }
        // If there is any node besides All selected, remove All from the list
        else if (
          matchedOptions.length > 1 &&
          matchedOptions.some((option) => option.id === 'allNodes')
        ) {
          const filteredNode: FieldInputOption[] = matchedOptions.filter(
            (n) => n.id !== 'allNodes'
          );
          setNode(filteredNode);
          setSearchParams({ node: filteredNode.map((n) => n.label) });
        } else {
          setNode(matchedOptions);
        }
      }
    }
  }, [searchParams, setSearchParams, nodeOptions]);

  function updateCategoricalQueryParams(fieldLabel: string, value: FieldInput) {
    switch (fieldLabel) {
      case 'Neurobagel graph':
        setNode(value);
        if (Array.isArray(value)) {
          setSearchParams({ node: value.map((n) => n.label) });
        }
        break;
      case 'Sex':
        setSex(value);
        break;
      case 'Diagnosis':
        setDiagnosis(value);
        break;
      case 'Assessment tool':
        setAssessmentTool(value);
        break;
      case 'Imaging modality':
        setImagingModality(value);
        break;
      default:
        break;
    }
  }

  function updateContinuousQueryParams(fieldLabel: string, value: string | null) {
    switch (fieldLabel) {
      case 'Min age':
        setMinAge(value);
        break;
      case 'Max age':
        setMaxAge(value);
        break;
      case 'Minimum number of sessions':
        setMinNumSessions(value);
        break;
      default:
        break;
    }
  }

  /**
   * Sets the value of a query parameter on the query parameter object.
   *
   * @remarks
   * This is a utility function to used to help construct the query URL using a URLSearchParams object.
   *
   * @param param - The name of the query parameter
   * @param value - The value of the query parameter
   * @param queryParamObject - The query parameter object which contains the query parameters
   * @returns void
   */
  function setQueryParam(param: string, value: FieldInput, queryParamObject: URLSearchParams) {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParamObject.append(param, v.id);
      });
    } else {
      queryParamObject.set(param, value?.id ?? '');
    }
  }

  /**
   * Creates the query URL from user input using a URLSearchParams object.
   *
   * @remarks
   * This function utilizes the `setQueryParam` function to set categorical query parameters.
   *
   * @returns The query URL.
   */
  function constructQueryURL() {
    const queryParams = new URLSearchParams();

    setQueryParam('node_url', node, queryParams);
    queryParams.set('min_age', minAge ?? '');
    queryParams.set('max_age', maxAge ?? '');
    setQueryParam('sex', sex, queryParams);
    setQueryParam('diagnosis', isControl ? null : diagnosis, queryParams);
    queryParams.set('is_control', isControl ? 'true' : '');
    queryParams.set('min_num_sessions', minNumSessions ?? '');
    setQueryParam('assessment', assessmentTool, queryParams);
    setQueryParam('image_modal', imagingModality, queryParams);

    // Notes:
    // 1. Deleting elements in an array as we loop over it is not good, either make a new object or filter (same thing)
    // 2. using forEach on the QueryParams object,
    // 3. Do the filtering first / switch before adding
    // Solution:
    // Push the keys to be deleted inside keysToDelete and loop over them and delete them from queryParams afterwards
    const keysToDelete: string[] = [];

    queryParams.forEach((value, key) => {
      // if All option is selected for nodes field, delete all node_urls
      if (value === '' || value === 'allNodes') {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      queryParams.delete(key);
    });

    return `${apiQueryURL}${queryParams.toString()}`;
  }

  return (
    <div
      className={
        isFederationAPI
          ? 'grid grid-cols-2 grid-rows-8 gap-2'
          : 'grid grid-cols-2 grid-rows-7 gap-2'
      }
    >
      {isFederationAPI && (
        <div className="col-span-2">
          <CategoricalField
            label="Neurobagel graph"
            options={nodeOptions.map((n) => ({
              label: n.NodeName,
              id: n.ApiURL,
            }))}
            onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
            multiple
            inputValue={node}
          />
        </div>
      )}
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          label="Min age"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className={isFederationAPI && 'row-start-2'}>
        <ContinuousField
          label="Max age"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className="col-span-2">
        <CategoricalField
          label="Sex"
          options={Object.entries(sexes).map(([key, value]) => ({
            label: key,
            id: value,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={sex}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-4' : 'col-span-2 row-start-3'}>
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-9">
            <CategoricalField
              label="Diagnosis"
              options={diagnosisOptions.map((d) => ({
                label: d.Label,
                id: d.TermURL,
              }))}
              onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
              inputValue={diagnosis}
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="healthyControl" />}
              label="Healthy Control"
              onChange={() => setIsControl(!isControl)}
            />
          </div>
        </div>
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-5' : 'col-span-2 row-start-4'}>
        <ContinuousField
          label="Minimum number of sessions"
          onFieldChange={(label, value) => updateContinuousQueryParams(label, value)}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-6' : 'col-span-2 row-start-5'}>
        <CategoricalField
          label="Assessment tool"
          options={assessmentOptions.map((a) => ({ label: a.Label, id: a.TermURL }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={assessmentTool}
        />
      </div>
      <div className={isFederationAPI ? 'col-span-2 row-start-7' : 'col-span-2 row-start-6'}>
        <CategoricalField
          label="Imaging modality"
          options={Object.entries(modalities).map(([, value]) => ({
            label: value.label,
            id: value.TermURL,
          }))}
          onFieldChange={(label, value) => updateCategoricalQueryParams(label, value)}
          inputValue={imagingModality}
        />
      </div>
      <div className={isFederationAPI ? 'row-start-8' : 'row-start-7'}>
        <Button
          variant="contained"
          endIcon={loading ? <CircularProgress size='20px' thickness={5.5} className='text-white'/> : <SendIcon />}
          onClick={() => onSubmitQuery(constructQueryURL())}
        >
          Submit Query
        </Button>
      </div>
    </div>
  );
}

export default QueryForm;
