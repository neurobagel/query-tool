import {
  nodeOptions,
  diagnosisOptions,
  pipelineOptions,
  pipelineVersionOptions,
} from '../fixtures/mocked-responses';

describe('App', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/nodes',
      },
      nodeOptions
    ).as('getNodes');
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
    cy.intercept(
      {
        method: 'GET',
        url: '/pipelines/np:fmriprep/versions',
      },
      pipelineVersionOptions
    ).as('getPipelineVersionsOptions');
    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getPipelineOptions']);

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
    cy.get('[data-cy="Diagnosis-categorical-field"]').should('contain', "Parkinson's disease");
  });
  it('Allows selecting a pipeline option in the Pipeline field', () => {
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').click();
    cy.contains('.MuiAutocomplete-option', 'fmriprep 0.2.3').click();
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should(
      'contain',
      'fmriprep 0.2.3'
    );
  });
  it('Should clear selected pipeline options when the clear button is clicked', () => {
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').click();
    cy.contains('.MuiAutocomplete-option', 'fmriprep 0.2.3').click();
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should(
      'contain',
      'fmriprep 0.2.3'
    );
    cy.get('[data-cy="Pipeline name and version-categorical-field"]')
      .find('.MuiAutocomplete-clearIndicator')
      .click({ force: true });
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should(
      'not.contain',
      'fmriprep 0.2.3'
    );
  });
  it('should clear specific pipeline versions when clicking the pipeline group header checkbox', () => {
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').click();
    cy.contains('.MuiAutocomplete-option', 'fmriprep 0.2.3').click();
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should(
      'contain',
      'fmriprep 0.2.3'
    );
    cy.get('[data-cy="pipeline-group-np:fmriprep-checkbox"]').click({ force: true });
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should('contain', 'fmriprep');
    cy.get('[data-cy="Pipeline name and version-categorical-field"]').should(
      'not.contain',
      'fmriprep 0.2.3'
    );
  });
  it('should toggle the filter form visibility when clicking the button', () => {
    cy.viewport(800, 600); // Mobile/tablet viewport
    cy.get('[data-cy="filter-toggle-button"]').should('be.visible');
    cy.get('[data-cy="query-form-container"]').should('be.visible');
    cy.contains('[data-cy="filter-toggle-button"]', 'Hide Query Form').should('exist');
    // The node error popups may hide the button, so we force the click as a workaround
    cy.get('[data-cy="filter-toggle-button"]').click({ force: true });
    cy.get('[data-cy="query-form-container"]').should('not.exist');
    cy.contains('[data-cy="filter-toggle-button"]', 'Show Query Form').should('exist');
    cy.get('[data-cy="filter-toggle-button"]').click({ force: true });
    cy.get('[data-cy="query-form-container"]').should('be.visible');
    cy.contains('[data-cy="filter-toggle-button"]', 'Hide Query Form').should('exist');
    cy.viewport(1200, 800); // Desktop viewport
    cy.get('[data-cy="filter-toggle-button"]').should('not.exist');
    cy.get('[data-cy="query-form-container"]').should('be.visible');
  });
  it('Selects different nodes in the nodes field', () => {
    cy.get('[data-cy="Neurobagel graph-categorical-field"] input').type(
      'OpenNeur{downarrow}{enter}'
    );
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('contain', 'OpenNeuro');
    cy.get('[data-cy="Neurobagel graph-categorical-field"] input').type('Quebec{downarrow}{enter}');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]')
      .should('contain', 'Quebec')
      .and('contain', 'OpenNeuro');
    cy.get('[data-cy="Neurobagel graph-categorical-field"] input').type('All{downarrow}{enter}');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]')
      .should('not.contain', 'Quebec')
      .and('not.contain', 'OpenNeuro');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('contain', 'All');
    cy.get('[data-cy="Neurobagel graph-categorical-field"] input').type(
      'OpenNeur{downarrow}{enter}'
    );
    cy.get('[data-cy="Neurobagel graph-categorical-field"] input').type('Quebec{downarrow}{enter}');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]')
      .find('.MuiAutocomplete-clearIndicator')
      .click({ force: true });
    cy.get('[data-cy="Neurobagel graph-categorical-field"]')
      .should('not.contain', 'Quebec')
      .and('not.contain', 'OpenNeuro');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('contain', 'All');
  });
});
