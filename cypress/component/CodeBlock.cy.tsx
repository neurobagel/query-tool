import CodeBlock from '../../src/components/CodeBlock';

const props = {
  codeExample: JSON.stringify(
    { error: [{ key: 'value' }, { key: 'value' }, { key: 'value' }] },
    null,
    2
  ),
};

describe('CodeBlock', () => {
  beforeEach(() => {
    // Mock the clipboard API for copy functionality
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });
  });

  it('renders the code block', () => {
    cy.mount(<CodeBlock code={props.codeExample} />);

    cy.get('[data-cy="error-container"]').contains('error');
  });

  it('displays the copy icon button', () => {
    cy.mount(<CodeBlock code={props.codeExample} />);

    cy.get('[data-testid="ContentCopyIcon"]').parent('button').should('exist').should('be.visible');
  });

  it('displays the copy icon button even for short code blocks', () => {
    cy.mount(<CodeBlock code="short code block" />);

    cy.get('[data-testid="ContentCopyIcon"]').parent('button').should('exist').should('be.visible');
  });

  it('shows popover when copy button is clicked', () => {
    cy.mount(<CodeBlock code={props.codeExample} />);

    cy.contains('Copied!').should('not.exist');
    cy.get('[data-testid="ContentCopyIcon"]').parent('button').click();
    cy.contains('Copied!').should('be.visible');
  });
});
