import QueryForm from '../../src/components/QueryForm';

const props = {
  availableNodes: [
    {
      NodeName: 'Some Node Name',
      ApiURL: 'https://someurl/',
    },
    {
      NodeName: 'Another Node Name',
      ApiURL: 'http://anotherurl/',
    },
  ],
  diagnosisOptions: [
    {
      Label: 'Some Diagnosis',
      TermURL: 'https://someurl/',
    },
    {
      Label: 'Another Diagnosis',
      TermURL: 'http://anotherurl/',
    },
  ],
  assessmentOptions: [
    {
      Label: 'Some Assessment',
      TermURL: 'https://someurl/',
    },
    {
      Label: 'Another Assessment',
      TermURL: 'http://anotherurl/',
    },
  ],
  selectedNode: [],
  minAge: null,
  maxAge: null,
  sex: null,
  diagnosis: null,
  isControl: false,
  minNumImagingSessions: null,
  minNumPhenotypicSessions: null,
  setIsControl: () => {},
  assessmentTool: null,
  imagingModality: null,
  pipelineVersion: null,
  pipelineName: null,
  pipelines: {
    'np:fmriprep': ['0.2.3', '23.1.3'],
  },
  updateCategoricalQueryParams: () => {},
  updateContinuousQueryParams: () => {},
  loading: false,
  onSubmitQuery: () => {},
};

describe('QueryForm', () => {
  it('Displays a set of fields for user input and a button for submitting query', () => {
    cy.mount(
      <QueryForm
        availableNodes={props.availableNodes}
        diagnosisOptions={props.diagnosisOptions}
        assessmentOptions={props.assessmentOptions}
        selectedNode={props.selectedNode}
        minAge={props.minAge}
        maxAge={props.maxAge}
        sex={props.sex}
        diagnosis={props.diagnosis}
        isControl={props.isControl}
        minNumImagingSessions={props.minNumImagingSessions}
        minNumPhenotypicSessions={props.minNumPhenotypicSessions}
        setIsControl={props.setIsControl}
        assessmentTool={props.assessmentTool}
        imagingModality={props.imagingModality}
        pipelineVersion={props.pipelineVersion}
        pipelineName={props.pipelineName}
        pipelines={props.pipelines}
        updateCategoricalQueryParams={props.updateCategoricalQueryParams}
        updateContinuousQueryParams={props.updateContinuousQueryParams}
        loading={props.loading}
        onSubmitQuery={props.onSubmitQuery}
      />
    );
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Minimum age-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Maximum age-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Sex-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Diagnosis-categorical-field"]').should('be.visible');
    cy.get('[data-cy="healthy-control-checkbox"]').should('be.visible');
    cy.get('[data-cy="Minimum number of imaging sessions-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Minimum number of phenotypic sessions-continuous-field"]').should(
      'be.visible'
    );
    cy.get('[data-cy="Assessment tool-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Imaging modality-categorical-field"]').should('be.visible');
    cy.get('[data-cy="submit-query-button"]').should('be.visible');
  });
  it('Fires updateCategoricalQueryParams event handler with the appropriate payload when a categorical field is selected', () => {
    const updateCategoricalQueryParamsSpy = cy.spy().as('updateCategoricalQueryParamsSpy');
    cy.mount(
      <QueryForm
        availableNodes={props.availableNodes}
        diagnosisOptions={props.diagnosisOptions}
        assessmentOptions={props.assessmentOptions}
        selectedNode={props.selectedNode}
        minAge={props.minAge}
        maxAge={props.maxAge}
        sex={props.sex}
        diagnosis={props.diagnosis}
        isControl={props.isControl}
        minNumImagingSessions={props.minNumImagingSessions}
        minNumPhenotypicSessions={props.minNumPhenotypicSessions}
        setIsControl={props.setIsControl}
        assessmentTool={props.assessmentTool}
        imagingModality={props.imagingModality}
        pipelineVersion={props.pipelineVersion}
        pipelineName={props.pipelineName}
        pipelines={props.pipelines}
        updateCategoricalQueryParams={updateCategoricalQueryParamsSpy}
        updateContinuousQueryParams={props.updateContinuousQueryParams}
        loading={props.loading}
        onSubmitQuery={props.onSubmitQuery}
      />
    );

    cy.get('[data-cy="Diagnosis-categorical-field"]').type('Some{downarrow}{enter}');
    cy.get('@updateCategoricalQueryParamsSpy').should('have.been.calledWith', 'Diagnosis', {
      id: 'https://someurl/',
      label: 'Some Diagnosis',
    });
  });
  it('Fires updateContinuousQueryParams event handler with the appropriate payload when a continuous field is selected', () => {
    const updateContinuousQueryParamsSpy = cy.spy().as('updateContinuousQueryParamsSpy');
    cy.mount(
      <QueryForm
        availableNodes={props.availableNodes}
        diagnosisOptions={props.diagnosisOptions}
        assessmentOptions={props.assessmentOptions}
        selectedNode={props.selectedNode}
        minAge={props.minAge}
        maxAge={props.maxAge}
        sex={props.sex}
        diagnosis={props.diagnosis}
        isControl={props.isControl}
        minNumImagingSessions={props.minNumImagingSessions}
        minNumPhenotypicSessions={props.minNumPhenotypicSessions}
        setIsControl={props.setIsControl}
        assessmentTool={props.assessmentTool}
        imagingModality={props.imagingModality}
        pipelineVersion={props.pipelineVersion}
        pipelineName={props.pipelineName}
        pipelines={props.pipelines}
        updateCategoricalQueryParams={props.updateCategoricalQueryParams}
        updateContinuousQueryParams={updateContinuousQueryParamsSpy}
        loading={props.loading}
        onSubmitQuery={props.onSubmitQuery}
      />
    );
    cy.get('[data-cy="Minimum age-continuous-field"]').type('10');
    cy.get('@updateContinuousQueryParamsSpy').should('have.been.calledWith', 'Minimum age', 10);
  });
  it('Fires the onSubmitQuery event handler when the submit button is clicked', () => {
    const onSubmitQuerySpy = cy.spy().as('onSubmitQuerySpy');
    cy.mount(
      <QueryForm
        availableNodes={props.availableNodes}
        diagnosisOptions={props.diagnosisOptions}
        assessmentOptions={props.assessmentOptions}
        selectedNode={props.selectedNode}
        minAge={props.minAge}
        maxAge={props.maxAge}
        sex={props.sex}
        diagnosis={props.diagnosis}
        isControl={props.isControl}
        minNumImagingSessions={props.minNumImagingSessions}
        minNumPhenotypicSessions={props.minNumPhenotypicSessions}
        setIsControl={props.setIsControl}
        assessmentTool={props.assessmentTool}
        imagingModality={props.imagingModality}
        pipelineVersion={props.pipelineVersion}
        pipelineName={props.pipelineName}
        pipelines={props.pipelines}
        updateCategoricalQueryParams={props.updateCategoricalQueryParams}
        updateContinuousQueryParams={props.updateContinuousQueryParams}
        loading={props.loading}
        onSubmitQuery={onSubmitQuerySpy}
      />
    );
    cy.get('[data-cy="submit-query-button"]').click();
    cy.get('@onSubmitQuerySpy').should('have.been.called');
  });
});
