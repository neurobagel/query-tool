import CollapsiblePipelineGroup from '../../src/components/CollapsiblePipelineGroup';

describe('CollapsiblePipelineGroup', () => {
  it('should render the group label and unchecked checkbox when pipeline is not selected', () => {
    const onTogglePipelineSpy = cy.spy().as('onTogglePipelineSpy');
    cy.mount(
      <ul>
        <CollapsiblePipelineGroup
          groupKey="np:fmriprep"
          groupLabel="fmriprep"
          selectedPipelines={[]}
          selectedVersions={[]}
          onTogglePipeline={onTogglePipelineSpy}
        >
          <li key="v1">fmriprep 0.2.3</li>
        </CollapsiblePipelineGroup>
      </ul>
    );

    cy.contains('fmriprep').should('be.visible');
    cy.get('[data-cy="pipeline-group-np:fmriprep-checkbox"] input').should('not.be.checked');
  });

  it('should render checkbox as checked when pipeline is selected without specific versions', () => {
    const onTogglePipelineSpy = cy.spy().as('onTogglePipelineSpy');
    cy.mount(
      <ul>
        <CollapsiblePipelineGroup
          groupKey="np:fmriprep"
          groupLabel="fmriprep"
          selectedPipelines={[{ id: 'np:fmriprep', label: 'fmriprep' }]}
          selectedVersions={[]}
          onTogglePipeline={onTogglePipelineSpy}
        >
          <li key="v1">fmriprep 0.2.3</li>
        </CollapsiblePipelineGroup>
      </ul>
    );

    cy.get('[data-cy="pipeline-group-np:fmriprep-checkbox"] input').should('be.checked');
  });

  it('should render checkbox as unchecked when specific versions are selected', () => {
    const onTogglePipelineSpy = cy.spy().as('onTogglePipelineSpy');
    cy.mount(
      <ul>
        <CollapsiblePipelineGroup
          groupKey="np:fmriprep"
          groupLabel="fmriprep"
          selectedPipelines={[{ id: 'np:fmriprep', label: 'fmriprep' }]}
          selectedVersions={[{ id: 'np:fmriprep::0.2.3', label: 'fmriprep 0.2.3' }]}
          onTogglePipeline={onTogglePipelineSpy}
        >
          <li key="v1">fmriprep 0.2.3</li>
        </CollapsiblePipelineGroup>
      </ul>
    );

    cy.get('[data-cy="pipeline-group-np:fmriprep-checkbox"] input').should('not.be.checked');
  });

  it('should fire onTogglePipeline event handler when clicking the group header checkbox', () => {
    const onTogglePipelineSpy = cy.spy().as('onTogglePipelineSpy');
    cy.mount(
      <ul>
        <CollapsiblePipelineGroup
          groupKey="np:fmriprep"
          groupLabel="fmriprep"
          selectedPipelines={[]}
          selectedVersions={[]}
          onTogglePipeline={onTogglePipelineSpy}
        >
          <li key="v1">fmriprep 0.2.3</li>
        </CollapsiblePipelineGroup>
      </ul>
    );

    cy.get('[data-cy="pipeline-group-np:fmriprep-checkbox"]').click({ force: true });
    cy.get('@onTogglePipelineSpy').should('have.been.calledWith', 'np:fmriprep', 'fmriprep');
  });
});
