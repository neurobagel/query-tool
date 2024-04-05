import {
  mixedResponse,
  partialSuccessMixedResponse,
  nodeOptions,
  diagnosisOptions,
  emptyDiagnosisOptions,
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
        url: '/nodes/',
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
    cy.get('.notistack-SnackbarContainer').should('contain', 'No Diagnosis options were available');
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

    cy.get('.notistack-SnackbarContainer').should(
      'contain',
      'No Assessment tool options were available'
    );
  });
});

describe('Partially successful API attribute responses', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/nodes/',
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
    cy.get('.notistack-SnackbarContainer').should('contain', 'NoAssessmentNode');
  });
  it('Shows warning for node that failed Diagnosis option request', () => {
    cy.get('.notistack-SnackbarContainer').should('contain', 'NoDiagnosisNode');
  });
});

describe('Failed API attribute responses', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/nodes/',
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
    cy.get('.notistack-SnackbarContainer').should('contain', 'Assessment');
  });
  it('Shows error toast for failed Diagnosis options', () => {
    cy.get('.notistack-SnackbarContainer').should('contain', 'Diagnosis');
  });
});

// TODO: maybe refactor query and attribute requests into separate files
describe('Successful API query requests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: 'query/?*',
      },
      mixedResponse
    ).as('call');

    cy.intercept(
      {
        method: 'GET',
        url: '/nodes/',
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
  it('Intercepts the request sent to the APpI and asserts over the request url', () => {
    cy.get('[data-cy="Minimum age-continuous-field"]').type('10');
    cy.get('[data-cy="Maximum age-continuous-field"]').type('30');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call').its('request.url').should('contains', 'min_age=10&max_age=30');
  });
});

describe('Partially successful API query requests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: 'query/?*',
      },
      partialSuccessMixedResponse
    ).as('call');

    cy.intercept(
      {
        method: 'GET',
        url: '/nodes/',
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
  it('Shows a warning for nodes that did not return any results', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('.notistack-SnackbarContainer').should('contain', 'DidNotWorkNode');
  });
});
