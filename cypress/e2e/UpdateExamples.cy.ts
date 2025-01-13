// This file automates the process of generating the query tool example files.
import fapiQuerySuccess200 from '../../neurobagel_examples/api-responses/fapi_query_success_200.json';

describe('Update Examples', () => {
  it('Generates result files using a successful FAPI query', () => {
    cy.intercept('GET', 'query*', (req) => {
      req.reply(fapiQuerySuccess200);
    }).as('call');
    cy.visit('/');
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('[data-cy="download-results-dropdown-button"]').click();
    cy.contains('URIs').click();
    cy.get('[data-cy="download-results-button"]').click();
  });
});
