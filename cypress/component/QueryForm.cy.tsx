import QueryForm from '../../src/components/QueryForm';

const defaultProps = {
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
  minAge: '',
  maxAge: '',
  sex: null,
  diagnosis: null,
  minNumImagingSessions: '',
  minNumPhenotypicSessions: '',
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
        availableNodes={defaultProps.availableNodes}
        diagnosisOptions={defaultProps.diagnosisOptions}
        assessmentOptions={defaultProps.assessmentOptions}
        selectedNode={defaultProps.selectedNode}
        minAge={defaultProps.minAge}
        maxAge={defaultProps.maxAge}
        sex={defaultProps.sex}
        diagnosis={defaultProps.diagnosis}
        minNumImagingSessions={defaultProps.minNumImagingSessions}
        minNumPhenotypicSessions={defaultProps.minNumPhenotypicSessions}
        assessmentTool={defaultProps.assessmentTool}
        imagingModality={defaultProps.imagingModality}
        pipelineVersion={defaultProps.pipelineVersion}
        pipelineName={defaultProps.pipelineName}
        pipelines={defaultProps.pipelines}
        updateCategoricalQueryParams={defaultProps.updateCategoricalQueryParams}
        updateContinuousQueryParams={defaultProps.updateContinuousQueryParams}
        loading={defaultProps.loading}
        onSubmitQuery={defaultProps.onSubmitQuery}
      />
    );
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Minimum age-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Maximum age-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Sex-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Diagnosis-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Minimum number of imaging sessions-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Minimum number of phenotypic sessions-continuous-field"]').should(
      'be.visible'
    );
    cy.get('[data-cy="Assessment tool-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Imaging modality-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Pipeline name-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Pipeline version-categorical-field"]').should('be.visible');
    cy.get('[data-cy="submit-query-button"]').should('be.visible');
    cy.get('[data-cy="how-to-get-data-dialog-button"]').should('be.visible');
  });
  it('Clicking the how to get data dialog button should open the dialog', () => {
    cy.mount(
      <QueryForm
        availableNodes={defaultProps.availableNodes}
        diagnosisOptions={defaultProps.diagnosisOptions}
        assessmentOptions={defaultProps.assessmentOptions}
        selectedNode={defaultProps.selectedNode}
        minAge={defaultProps.minAge}
        maxAge={defaultProps.maxAge}
        sex={defaultProps.sex}
        diagnosis={defaultProps.diagnosis}
        minNumImagingSessions={defaultProps.minNumImagingSessions}
        minNumPhenotypicSessions={defaultProps.minNumPhenotypicSessions}
        assessmentTool={defaultProps.assessmentTool}
        imagingModality={defaultProps.imagingModality}
        pipelineVersion={defaultProps.pipelineVersion}
        pipelineName={defaultProps.pipelineName}
        pipelines={defaultProps.pipelines}
        updateCategoricalQueryParams={defaultProps.updateCategoricalQueryParams}
        updateContinuousQueryParams={defaultProps.updateContinuousQueryParams}
        loading={defaultProps.loading}
        onSubmitQuery={defaultProps.onSubmitQuery}
      />
    );
    cy.get('[data-cy="get-data-dialog"]').should('not.exist');
    cy.get('[data-cy="how-to-get-data-dialog-button"]').click();
    cy.get('[data-cy="get-data-dialog"]').should('be.visible');
  });
  it('Fires updateCategoricalQueryParams event handler with the appropriate payload when a categorical field is selected', () => {
    const updateCategoricalQueryParamsSpy = cy.spy().as('updateCategoricalQueryParamsSpy');
    cy.mount(
      <QueryForm
        availableNodes={defaultProps.availableNodes}
        diagnosisOptions={defaultProps.diagnosisOptions}
        assessmentOptions={defaultProps.assessmentOptions}
        selectedNode={defaultProps.selectedNode}
        minAge={defaultProps.minAge}
        maxAge={defaultProps.maxAge}
        sex={defaultProps.sex}
        diagnosis={defaultProps.diagnosis}
        minNumImagingSessions={defaultProps.minNumImagingSessions}
        minNumPhenotypicSessions={defaultProps.minNumPhenotypicSessions}
        assessmentTool={defaultProps.assessmentTool}
        imagingModality={defaultProps.imagingModality}
        pipelineVersion={defaultProps.pipelineVersion}
        pipelineName={defaultProps.pipelineName}
        pipelines={defaultProps.pipelines}
        updateCategoricalQueryParams={updateCategoricalQueryParamsSpy}
        updateContinuousQueryParams={defaultProps.updateContinuousQueryParams}
        loading={defaultProps.loading}
        onSubmitQuery={defaultProps.onSubmitQuery}
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
        availableNodes={defaultProps.availableNodes}
        diagnosisOptions={defaultProps.diagnosisOptions}
        assessmentOptions={defaultProps.assessmentOptions}
        selectedNode={defaultProps.selectedNode}
        minAge="1"
        maxAge={defaultProps.maxAge}
        sex={defaultProps.sex}
        diagnosis={defaultProps.diagnosis}
        minNumImagingSessions={defaultProps.minNumImagingSessions}
        minNumPhenotypicSessions={defaultProps.minNumPhenotypicSessions}
        assessmentTool={defaultProps.assessmentTool}
        imagingModality={defaultProps.imagingModality}
        pipelineVersion={defaultProps.pipelineVersion}
        pipelineName={defaultProps.pipelineName}
        pipelines={defaultProps.pipelines}
        updateCategoricalQueryParams={defaultProps.updateCategoricalQueryParams}
        updateContinuousQueryParams={updateContinuousQueryParamsSpy}
        loading={defaultProps.loading}
        onSubmitQuery={defaultProps.onSubmitQuery}
      />
    );
    cy.get('[data-cy="Minimum age-continuous-field"] input').type('0');
    cy.get('@updateContinuousQueryParamsSpy').should('have.been.calledWith', 'Minimum age', '10');
  });
  it('Fires the onSubmitQuery event handler when the submit button is clicked', () => {
    const onSubmitQuerySpy = cy.spy().as('onSubmitQuerySpy');
    cy.mount(
      <QueryForm
        availableNodes={defaultProps.availableNodes}
        diagnosisOptions={defaultProps.diagnosisOptions}
        assessmentOptions={defaultProps.assessmentOptions}
        selectedNode={defaultProps.selectedNode}
        minAge={defaultProps.minAge}
        maxAge={defaultProps.maxAge}
        sex={defaultProps.sex}
        diagnosis={defaultProps.diagnosis}
        minNumImagingSessions={defaultProps.minNumImagingSessions}
        minNumPhenotypicSessions={defaultProps.minNumPhenotypicSessions}
        assessmentTool={defaultProps.assessmentTool}
        imagingModality={defaultProps.imagingModality}
        pipelineVersion={defaultProps.pipelineVersion}
        pipelineName={defaultProps.pipelineName}
        pipelines={defaultProps.pipelines}
        updateCategoricalQueryParams={defaultProps.updateCategoricalQueryParams}
        updateContinuousQueryParams={defaultProps.updateContinuousQueryParams}
        loading={defaultProps.loading}
        onSubmitQuery={onSubmitQuerySpy}
      />
    );
    cy.get('[data-cy="submit-query-button"]').click();
    cy.get('@onSubmitQuerySpy').should('have.been.called');
  });
});
