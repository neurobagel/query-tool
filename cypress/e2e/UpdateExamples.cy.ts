// This file automates the process of generating the query tool example files.
import fapiQuerySuccess200 from '../../neurobagel_examples/api-responses/fapi_post_datasets_success_200.json';
import fapiPostSubjects from '../../neurobagel_examples/api-responses/fapi_post_subjects_success_200.json';

describe('Update Examples', () => {
  it('Generates result files using a successful FAPI query', () => {
    cy.intercept({
      method: 'GET',
      url: '/diagnoses',
    }).as('getDiagnosisOptions');
    cy.intercept({
      method: 'GET',
      url: '/assessments',
    }).as('getAssessmentToolOptions');
    cy.intercept('POST', '/datasets', (req) => {
      req.reply(fapiQuerySuccess200);
    }).as('call');
    cy.intercept('POST', '/subjects', (req) => {
      req.reply(fapiPostSubjects);
    }).as('subjectsCall');
    cy.visit('/');
    cy.wait(['@getDiagnosisOptions', '@getAssessmentToolOptions']);
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    // Freeze (mock) the clock to ensure the downloaded file name is static and predictable.
    // This allows us to use cy.readFile(), which natively retries (up to the global timeout)
    cy.clock(Date.UTC(2025, 0, 1), ['Date']);

    cy.get('[data-cy="download-results-button"]').click();

    cy.readFile('cypress/downloads/neurobagel-query-results_20250101000000.tsv').should('exist');

    cy.get('[data-cy="download-radio-1"]').click();
    cy.get('[data-cy="download-results-button"]').click();

    cy.readFile('cypress/downloads/neurobagel-query-results-with-URIs_20250101000000.tsv').should(
      'exist'
    );
  });
});
