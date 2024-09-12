import {
  mixedResponse,
  partialSuccessMixedResponse,
  failedQueryResponse,
  nodeOptions,
  diagnosisOptions,
  emptyDiagnosisOptions,
  badDiagnosisOptions,
  partiallyFailedDiagnosisToolOptions,
  failedDiagnosisToolOptions,
  assessmentToolOptions,
  emptyAssessmentToolOptions,
  partiallyFailedAssessmentToolOptions,
  failedAssessmentToolOptions,
} from '../fixtures/mocked-responses';

describe('Successful API attribute responses', () => {
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
        url: '/attributes/nb:Diagnosis',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
  });
  it('Loads correctly if all node responses are successful', () => {
    cy.get('.notistack-SnackbarContainer').should('not.exist');
  });
  it('Empty diagnosis response makes info toast appear', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Diagnosis',
      },
      emptyDiagnosisOptions
    ).as('getDiagnosisOptions');
    cy.visit('/');
    cy.wait('@getDiagnosisOptions');
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-info')
      .should('contain', 'No Diagnosis options were available');
  });
  it('Empty assessment response makes info toast appear', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      emptyAssessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait('@getAssessmentToolOptions');

    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-info')
      .should('contain', 'No Assessment options were available');
  });
});

describe('Partially successful API attribute responses', () => {
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
        url: '/attributes/nb:Diagnosis',
      },
      partiallyFailedDiagnosisToolOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      partiallyFailedAssessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
  });
  it('Shows warning for node that failed Assessment tool option request', () => {
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-warning')
      .should('contain', 'NoAssessmentNode');
  });
  it('Shows warning for node that failed Diagnosis option request', () => {
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-warning')
      .should('contain', 'NoDiagnosisNode');
  });
});

describe('Failed API attribute responses', () => {
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
        url: '/attributes/nb:Diagnosis',
      },
      failedDiagnosisToolOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      failedAssessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
  });
  it('Shows error toast for failed Assessment tool options', () => {
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-error')
      .should('contain', 'Assessment');
  });
  it('Shows error toast for failed Diagnosis options', () => {
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-error')
      .should('contain', 'Diagnosis');
  });
});

// TODO: maybe refactor query and attribute requests into separate files
describe('Successful API query requests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: 'query?*',
      },
      mixedResponse
    ).as('call');

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
        url: '/attributes/nb:Diagnosis',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();
  });
  it('Intercepts the request sent to the API and asserts over the request url', () => {
    cy.get('[data-cy="Minimum age-continuous-field"]').type('10');
    cy.get('[data-cy="Maximum age-continuous-field"]').type('30');
    cy.get('[data-cy="Minimum number of imaging sessions-continuous-field"]').type('2');
    cy.get('[data-cy="Minimum number of phenotypic sessions-continuous-field"]').type('3');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call')
      .its('request.url')
      .should('contain', 'min_age=10')
      .and('contain', 'max_age=30')
      .and('contain', 'min_num_imaging_sessions=2')
      .and('contain', 'min_num_phenotypic_sessions=3');
  });
});

// Bad things that should no longer happen
describe('Regression Tests', () => {
  it('App can start if attributes have null values and filters out bad attributes', () => {
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
        url: '/attributes/nb:Diagnosis',
      },
      badDiagnosisOptions
    ).as('getDiagnosisOptions');

    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');

    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();

    cy.get('[data-cy="Diagnosis-categorical-field"]').type('parkin{downarrow}{enter}');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should(
      'have.value',
      "Parkinson's disease"
    );
  });
});

describe('Partially successful API query requests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: 'query?*',
      },
      partialSuccessMixedResponse
    ).as('call');

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
        url: '/attributes/nb:Diagnosis',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');

    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');

    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();
  });
  it('Shows a warning for nodes that failed to return any results', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-warning')
      .should('contain', 'DidNotWorkNode');
  });
});

describe('Failed API query requests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: 'query?*',
      },
      failedQueryResponse
    ).as('call');

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
        url: '/attributes/nb:Diagnosis',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');

    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');

    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();
  });
  it('Shows an error toast and does not display results for a completely failed ', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('.notistack-SnackbarContainer')
      .find('.notistack-MuiContent-error')
      .should('contain', 'Error')
      .and('contain', 'All nodes');
    cy.get('[data-cy="result-container"]')
      .should('contain', 'Query failed')
      .and('contain', 'Please try again');
  });
});
