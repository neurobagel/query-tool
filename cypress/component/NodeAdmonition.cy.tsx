import NodeAdmonition from '../../src/components/NodeAdmonition';

describe('<NodeAdmonition />', () => {
  it('should render single node as simple alert', () => {
    cy.mount(<NodeAdmonition nodes={['OpenNeuro']} onDismiss={cy.stub()} />);

    cy.get('[data-cy="openneuro-alert"]').should('be.visible');
    cy.contains('The OpenNeuro node is being actively annotated').should('be.visible');
    cy.get('[role="tab"]').should('not.exist');
  });

  it('should render multiple nodes with horizontal tabs', () => {
    cy.mount(<NodeAdmonition nodes={['OpenNeuro', 'EBRAINS']} onDismiss={cy.stub()} />);

    cy.get('[role="tab"]').should('have.length', 2);
    cy.contains('[role="tab"]', 'OpenNeuro').should('be.visible');
    cy.contains('[role="tab"]', 'EBRAINS').should('be.visible');

    // First tab should be selected by default
    cy.get('[data-cy="openneuro-alert"]').should('be.visible');
    cy.contains('The OpenNeuro node is being actively annotated').should('be.visible');
  });

  it('should switch content when clicking different tabs', () => {
    cy.mount(<NodeAdmonition nodes={['OpenNeuro', 'EBRAINS']} onDismiss={cy.stub()} />);

    // First tab should be selected by default
    cy.get('[data-cy="openneuro-alert"]').should('be.visible');
    cy.contains('The OpenNeuro node is being actively annotated').should('be.visible');

    cy.contains('[role="tab"]', 'EBRAINS').click();
    cy.get('[data-cy="ebrains-alert"]').should('be.visible');
    cy.contains('The EBRAINS node is being actively annotated').should('be.visible');
  });

  it('should emit dismiss event with node name when close button in tab is clicked', () => {
    const onDismissSpy = cy.stub().as('dismissHandler');

    cy.mount(<NodeAdmonition nodes={['OpenNeuro', 'EBRAINS']} onDismiss={onDismissSpy} />);

    cy.contains('[role="tab"]', 'OpenNeuro').find('button').click();
    cy.get('@dismissHandler').should('have.been.calledOnceWith', 'OpenNeuro');
  });

  it('should emit dismiss event for single node alert', () => {
    const onDismissSpy = cy.stub().as('dismissHandler');

    cy.mount(<NodeAdmonition nodes={['OpenNeuro']} onDismiss={onDismissSpy} />);

    cy.get('[data-cy="openneuro-alert"]').within(() => {
      cy.get('button').click();
    });
    cy.get('@dismissHandler').should('have.been.calledOnceWith', 'OpenNeuro');
  });

  it('should not render admonitions for nodes without config', () => {
    cy.mount(<NodeAdmonition nodes={['NonExistentNode']} onDismiss={cy.stub()} />);

    cy.get('[role="alert"]').should('not.exist');
  });

  it('should not render when nodes array is empty', () => {
    cy.mount(<NodeAdmonition nodes={[]} onDismiss={cy.stub()} />);

    cy.get('[role="alert"]').should('not.exist');
  });
});
