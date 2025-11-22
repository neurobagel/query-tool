import NodeAdmonition from '../../src/components/NodeAdmonition';

describe('<NodeAdmonition />', () => {
  it('renders with provided text', () => {
    cy.mount(
      <NodeAdmonition
        text="This is a test admonition message"
        onClose={cy.stub().as('closeHandler')}
        dataCy="test-admonition"
      />
    );

    cy.get('[data-cy="test-admonition"]').should('exist');
    cy.contains('This is a test admonition message').should('be.visible');
  });

  it('emits close event when dismiss button is clicked', () => {
    const onCloseSpy = cy.stub().as('closeHandler');

    cy.mount(<NodeAdmonition text="Test message" onClose={onCloseSpy} dataCy="test-admonition" />);

    cy.get('[data-cy="test-admonition"]').should('be.visible');
    cy.get('[data-cy="test-admonition"] button').click();
    cy.get('@closeHandler').should('have.been.calledOnce');
  });

  it('hides when show prop is false', () => {
    cy.mount(
      <NodeAdmonition
        text="Hidden message"
        show={false}
        onClose={cy.stub()}
        dataCy="hidden-admonition"
      />
    );

    cy.get('[data-cy="hidden-admonition"]').should('not.exist');
  });
});
