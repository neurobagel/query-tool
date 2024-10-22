import {
  diagnosisOptions,
  pipelineOptions,
  pipelineVersionOptions,
} from '../fixtures/mocked-responses';

describe('App', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/diagnoses',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/pipelines',
      },
      pipelineOptions
    ).as('getPipelineOptions');
    cy.visit('/');
    cy.wait(['@getDiagnosisOptions', '@getPipelineOptions']);

    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();
  });
  it('Validates input to continuous field, displays the appropriate error, and disables the submit query button', () => {
    cy.get('[data-cy="submit-query-button"]').should('not.be.disabled');
    cy.get('[data-cy="Minimum age-continuous-field"]').type('some text');
    cy.get('[data-cy="Minimum age-continuous-field"] p')
      .should('be.visible')
      .should('contain', 'Please enter a valid number!')
      .should('have.class', 'Mui-error');
    cy.get('[data-cy="submit-query-button"]').should('be.disabled');
    cy.get('[data-cy="Minimum age-continuous-field"] input').clear();
    cy.get('[data-cy="submit-query-button"]').should('not.be.disabled');
    cy.get('[data-cy="Minimum age-continuous-field"]').type('-10');
    cy.get('[data-cy="Minimum age-continuous-field"] p')
      .should('be.visible')
      .should('contain', 'Please enter a positive number!');
    cy.get('[data-cy="submit-query-button"]').should('be.disabled');
  });

  it('Displays the diagnosis options it retrieves from a node API', () => {
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should('not.be.disabled');
    cy.get('[data-cy="Diagnosis-categorical-field"]').type('parkin{downarrow}{enter}');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should(
      'have.value',
      "Parkinson's disease"
    );
  });

  it('Disables the diagnosis field if healthy control checkbox is checked', () => {
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should('not.be.disabled');
    cy.get('[data-cy="Diagnosis-categorical-field"]').type('parkin{downarrow}{enter}');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should(
      'have.value',
      "Parkinson's disease"
    );
    cy.get('[data-cy="healthy-control-checkbox"]').click();
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should('be.disabled');
    cy.get('[data-cy="healthy-control-checkbox"]').click();
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should('not.be.disabled');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should(
      'have.value',
      "Parkinson's disease"
    );
  });
  it.only('Enables the pipeline version field once a pipeline name is selected', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/pipelines/np:fmriprep/versions',
      },
      pipelineVersionOptions
    ).as('getPipelineVersionsOptions');
    cy.get('[data-cy="Pipeline version-categorical-field"] input').should('be.disabled');
    cy.get('[data-cy="Pipeline name-categorical-field"]').type('fmri{downarrow}{enter}');
    cy.wait('@getPipelineVersionsOptions');
    cy.get('[data-cy="Pipeline version-categorical-field"] input').should('not.be.disabled');
    cy.get('[data-cy="Pipeline version-categorical-field"]').type('0.2.3{downarrow}{enter}');
    cy.get('[data-cy="Pipeline version-categorical-field"] input').should('have.value', '0.2.3');
  });
});
