import { missingFieldsResponse } from '../fixtures/mocked-responses';

describe('Error Boundary Regression Test', () => {
  it('Should catch application crashes with the Custom Error Boundary', () => {
    cy.visit('/');
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.intercept('POST', '**/datasets', missingFieldsResponse).as('postQuery');

    // Ignore uncaught exceptions to allow debugging of what is rendered
    cy.on('uncaught:exception', () => false);

    cy.get('button').contains('Submit Query').click();

    // Wait for the crash
    cy.wait('@postQuery');

    cy.get('[data-cy="error-boundary"]')
      .should('be.visible')
      .and('contain', 'This is not supposed to happen');

    // Verify the "Unexpected Application Error!" is NOT there to be double sure
    cy.contains('Unexpected Application Error!').should('not.exist');
  });
});
