import {
  mixedResponse,
  nodeOptions,
  emptyDiagnosisOptions,
  diagnosisOptions,
  emptyAssessmentToolOptions,
  assessmentToolOptions,
} from '../fixtures/mocked-responses';

// TODO: Put some of the setup in a beforeEach block
describe('API request', () => {
  it.only('Loads correctly if all node responses are successful', () => {
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
    cy.wait('@getNodes');
    cy.wait('@getDiagnosisOptions');
    cy.wait('@getAssessmentToolOptions');

    cy.get('.notistack-SnackbarContainer').should('not.exist');
  });
  it('Intercepts the request sent to the APpI and asserts over the request url', () => {
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
    cy.visit('/?node=OpenNeuro');
    // We need to wait for the fetch to complete and populate the
    // dropdown with nodes and selecting OpenNeuro before making the request
    cy.wait('@getNodes');
    cy.get('[data-cy="Minimum age-continuous-field"]').type('10');
    cy.get('[data-cy="Maximum age-continuous-field"]').type('30');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call').its('request.url').should('contains', '&min_age=10&max_age=30');
  });
  it('Empty responses for diagnosis and Assessment make a toast appear', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Diagnosis',
      },
      emptyDiagnosisOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      emptyAssessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait('@getDiagnosisOptions');
    cy.get('.notistack-SnackbarContainer').should('contain', 'No Diagnosis options were available');
    cy.get('.notistack-SnackbarContainer').should(
      'contain',
      'No Assessment tool options were available'
    );
  });
  it('Failed responses for diagnosis and assessment make an error toast appear', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Diagnosis',
      },
      { statusCode: 500 }
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/attributes/nb:Assessment',
      },
      { statusCode: 500 }
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait('@getDiagnosisOptions');
    cy.get('.notistack-SnackbarContainer').should(
      'contain',
      'Failed to retrieve Diagnosis options'
    );
    cy.wait('@getAssessmentToolOptions');
    cy.get('.notistack-SnackbarContainer').should(
      'contain',
      'Failed to retrieve Assessment tool options'
    );
  });
});
