import PipelineField from '../../src/components/PipelineField';

describe('PipelineField', () => {
  const mockPipelines = {
    'np:fmriprep': ['0.2.3', '0.2.4'],
    'np:freesurfer': ['7.1.0'],
  };

  it('should render the field with label and placeholder', () => {
    cy.mount(<PipelineField pipelines={mockPipelines} value={[]} onFieldChange={() => {}} />);
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Pipeline name and version-categorical-field"] label').should(
      'contain',
      'Pipeline name and version'
    );
  });

  it('should fire onFieldChange when a specific version is selected', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <PipelineField pipelines={mockPipelines} value={[]} onFieldChange={onFieldChangeSpy} />
    );

    cy.get('[data-cy="Pipeline name and version-categorical-field"]').click();
    cy.contains('fmriprep').click();
    cy.contains('.MuiAutocomplete-option', 'fmriprep 0.2.3').click();
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', [
      { pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep', version: '0.2.3' },
    ]);
  });

  it('should fire onFieldChange when a pipeline group header is toggled', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <PipelineField pipelines={mockPipelines} value={[]} onFieldChange={onFieldChangeSpy} />
    );

    cy.get('[data-cy="Pipeline name and version-categorical-field"]').click();
    cy.get('[data-cy="pipeline-group-np:fmriprep-checkbox"]').click({ force: true });
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', [
      { pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep' },
    ]);
  });

  it('should display selected pipeline pill as "<name> any version"', () => {
    cy.mount(
      <PipelineField
        pipelines={mockPipelines}
        value={[{ pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep' }]}
        onFieldChange={() => {}}
      />
    );

    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should(
      'contain',
      'fmriprep any version'
    );
  });
});
