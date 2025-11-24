import NodeAdmonition from '../../src/components/NodeAdmonition';

describe('<NodeAdmonition />', () => {
  it('should render admonitions for provided nodes', () => {
    cy.mount(<NodeAdmonition nodes={['OpenNeuro', 'EBRAINS']} onDismiss={cy.stub()} />);

    cy.get('[data-cy="openneuro-alert"]').should('exist');
    cy.contains('The OpenNeuro node is being actively annotated').should('be.visible');

    cy.get('[data-cy="ebrains-alert"]').should('exist');
    cy.contains('The EBRAINS node is being actively annotated').should('be.visible');
  });

  it('should emit dismiss event with node name when close button is clicked', () => {
    const onDismissSpy = cy.stub().as('dismissHandler');

    cy.mount(<NodeAdmonition nodes={['OpenNeuro']} onDismiss={onDismissSpy} />);

    cy.get('[data-cy="openneuro-alert"]').should('be.visible');
    cy.get('[data-cy="openneuro-alert"] button').click();
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

  it('should render multiple admonitions stacked vertically', () => {
    cy.mount(<NodeAdmonition nodes={['OpenNeuro', 'EBRAINS']} onDismiss={cy.stub()} />);

    cy.get('[data-cy="openneuro-alert"]').should('exist');
    cy.get('[data-cy="ebrains-alert"]').should('exist');

    // Check they're stacked (ebrains should be below openneuro)
    cy.get('[data-cy="openneuro-alert"]').then(($openneuro) => {
      cy.get('[data-cy="ebrains-alert"]').then(($ebrains) => {
        expect($ebrains[0].getBoundingClientRect().top).to.be.greaterThan(
          $openneuro[0].getBoundingClientRect().bottom
        );
      });
    });
  });
});
