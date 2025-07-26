import CodeBlock from '../../src/components/CodeBlock';

describe('CodeBlock', () => {
  beforeEach(() => {
    // Mock the clipboard API for copy functionality
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });
  });

  it('renders the code block with copy button', () => {
    cy.mount(<CodeBlock />);

    // Check that the main container exists
    cy.get('div').should('have.class', 'flex');
    cy.get('div').should('have.class', 'items-center');
    cy.get('div').should('have.class', 'rounded');
    cy.get('div').should('have.class', 'bg-gray-200');

    // Check that the code element exists
    cy.get('code').should('exist');
    cy.get('code').should('have.class', 'flex-grow');
    cy.get('code').should('have.class', 'text-black');
  });

  it('displays the copy icon button', () => {
    cy.mount(<CodeBlock />);

    // Check that the IconButton exists and is clickable
    cy.get('[data-testid="ContentCopyIcon"]').parent('button').should('exist').should('be.visible');
  });

  it('shows popover when copy button is clicked', () => {
    cy.mount(<CodeBlock />);

    // Initially, the popover should not be visible
    cy.contains('Copied!').should('not.exist');

    // Click the copy button
    cy.get('[data-testid="ContentCopyIcon"]').parent('button').click();

    // The popover with "Copied!" message should appear
    cy.contains('Copied!').should('be.visible');
  });

  it('has correct styling for the code element', () => {
    cy.mount(<CodeBlock />);

    // Verify the code element has the expected classes
    cy.get('code').should('have.class', 'flex-grow').should('have.class', 'text-black');
  });

  it('popover has correct positioning', () => {
    cy.mount(<CodeBlock />);

    // Click to show popover
    cy.get('[data-testid="ContentCopyIcon"]').parent('button').click();

    // Check that the popover appears with correct content
    cy.get('[role="presentation"]').within(() => {
      cy.contains('Copied!')
        .should('be.visible')
        .should('have.class', 'rounded')
        .should('have.class', 'px-2')
        .should('have.class', 'py-1')
        .should('have.class', 'text-sm')
        .should('have.class', 'text-white')
        .should('have.class', 'shadow');
    });
  });

  it('copy button has hover styles', () => {
    cy.mount(<CodeBlock />);

    cy.get('[data-testid="ContentCopyIcon"]')
      .parent('button')
      .should('have.css', 'color') // Should have primary color
      .trigger('mouseover');

    // Note: Testing exact hover styles might require more specific setup
    // depending on how the theme is configured
  });
});
