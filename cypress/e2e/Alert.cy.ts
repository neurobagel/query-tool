import {
  failedAssessmentToolOptions,
  failedDiagnosisToolOptions,
  pipelineOptions,
  nodeOptions,
} from '../fixtures/mocked-responses';

describe('Alerts', () => {
  it('Correctly displays and dismisses the alert', () => {
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
        url: 'diagnoses',
      },
      failedDiagnosisToolOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/assessments',
      },
      failedAssessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/pipelines',
      },
      pipelineOptions
    ).as('getPipelineOptions');
    cy.visit('/?node=All');
    cy.wait([
      '@getNodes',
      '@getDiagnosisOptions',
      '@getAssessmentToolOptions',
      '@getPipelineOptions',
    ]);
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();

    // We need to wait for the fetch to complete and populate the
    // dropdown with nodes before searching for OpenNeuro
    cy.get('[data-cy="openneuro-alert"]')
      .should('be.visible')
      .should('contain', 'The OpenNeuro node is being actively annotated at the participant');

    cy.get('[data-cy="Neurobagel graph-categorical-field"]').type(
      'Quebec Parkinson Network{downarrow}{enter}'
    );
    cy.get('[data-cy="openneuro-alert"]').should('not.exist');

    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('not.contain', 'All');
    cy.get('[data-cy="Neurobagel graph-categorical-field"]')
      .find('[data-testid="CloseIcon"]')
      .click();
    cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('contain', 'All');

    cy.get('[data-cy="Neurobagel graph-categorical-field"]').type('OpenNeuro{downarrow}{enter}');
    cy.get('[data-cy="openneuro-alert"]').should('be.visible');

    cy.get('[data-cy="openneuro-alert"]').find('[data-testid="CloseIcon"]').click();
    cy.get('[data-cy="openneuro-alert"]').should('not.exist');
  });
  it.only('Displays and closes small screen size dialog', () => {
    cy.viewport(766, 500);
    cy.visit('/');
    cy.get('[data-cy="small-screen-size-dialog"]').should('be.visible');
    cy.get('[data-cy="close-small-screen-size-dialog-button"]').click();
    cy.get('[data-cy="small-screen-size-dialog"]').should('not.exist');
  });
});
