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
    /* 
    Explicitly wait for the downloaded files to exist to ensure
    the test fails if the download fails silently (e.g., due to a data mismatch).
    */

    const checkForFile = (pattern: string) => {
      // Retry logic: cy.task yields the result. If null, retry recursively until timeout.
      const timeout = 10000;
      const start = Date.now();

      const check = () => {
        cy.task('getLatestFile', pattern).then((found) => {
          if (!found) {
            if (Date.now() - start > timeout) {
              throw new Error(`File matching ${pattern} not found after ${timeout}ms`);
            }
            check();
          }
        });
      };
      check();
    };

    cy.get('[data-cy="download-results-button"]').click();
    checkForFile('cypress/downloads/neurobagel-query-results_*.tsv');
    cy.get('[data-cy="download-radio-1"]').click();
    cy.get('[data-cy="download-results-button"]').click();
    checkForFile('cypress/downloads/neurobagel-query-results-with-URIs_*.tsv');
  });
});
