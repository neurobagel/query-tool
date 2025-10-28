import {
  assessmentToolOptions,
  diagnosisOptions,
  nodeOptions,
  pipelineOptions,
  protectedResponse2,
} from '../fixtures/mocked-responses';

describe('Undo cohort changes', () => {
  beforeEach(() => {
    cy.intercept('GET', '/nodes', nodeOptions).as('getNodes');
    cy.intercept('GET', '/diagnoses', diagnosisOptions).as('getDiagnoses');
    cy.intercept('GET', '/assessments', assessmentToolOptions).as('getAssessments');
    cy.intercept('GET', '/pipelines', pipelineOptions).as('getPipelines');
    cy.intercept('POST', '/datasets', protectedResponse2).as('datasetsQuery');

    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnoses', '@getAssessments', '@getPipelines']);

    cy.get('[data-cy="close-auth-dialog-button"]').click();
  });

  function runQueryAndSelectFirstDataset() {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@datasetsQuery');
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001-checkbox"] input').check();
    cy.get('[data-cy="download-results-button"]').should('not.be.disabled');
  }

  it('restores continuous field changes and re-enables downloads after undo', () => {
    runQueryAndSelectFirstDataset();

    cy.get('[data-cy="Minimum age-continuous-field"]').type('10');
    cy.get('[data-cy="query-form-changed-alert"]').should('be.visible');
    cy.get('[data-cy="download-results-button"]').should('be.disabled');

    cy.get('[data-cy="query-form-changed-alert"]').contains('button', 'Undo changes').click();

    cy.get('[data-cy="query-form-changed-alert"]').should('not.exist');
    cy.get('[data-cy="Minimum age-continuous-field"] input').should('have.value', '');
    cy.get('[data-cy="download-results-button"]').should('not.be.disabled');
  });

  it('restores categorical field changes and re-enables downloads after undo', () => {
    runQueryAndSelectFirstDataset();

    cy.get('[data-cy="Diagnosis-categorical-field"]').type('parkin{downarrow}{enter}');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should(
      'have.value',
      "Parkinson's disease"
    );
    cy.get('[data-cy="query-form-changed-alert"]').should('be.visible');
    cy.get('[data-cy="download-results-button"]').should('be.disabled');

    cy.get('[data-cy="query-form-changed-alert"]').contains('button', 'Undo changes').click();

    cy.get('[data-cy="query-form-changed-alert"]').should('not.exist');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should('have.value', '');
    cy.get('[data-cy="download-results-button"]').should('not.be.disabled');
  });
});
