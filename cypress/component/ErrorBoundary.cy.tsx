import ErrorBoundary from '../../src/components/ErrorBoundary';

const ErrorThrowingComponent: React.FC = function ErrorThrowingComponent() {
  throw new Error('Test error');
};

// Prevent Cypress from failing since the test error is expected
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Test error')) {
    return false;
  }
  return true;
});
describe('ErrorBoundary', () => {
  it('should display fallback UI when an error is thrown', () => {
    cy.mount(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    cy.contains('This is not supposed to happen').should('be.visible');
    cy.contains('Show Details').should('be.visible');

    cy.contains('Show Details').click();

    cy.contains('Error: Test error').should('be.visible');
    cy.contains('Component Stack:').should('be.visible');
    cy.contains('at ErrorThrowingComponent').should('be.visible');
  });
});
