import {
  failedAssessmentToolOptions,
  failedDiagnosisToolOptions,
  nodeOptions,
  protectedResponse1,
  protectedResponse2,
} from '../fixtures/mocked-responses';

describe('Dataset result checkbox', () => {
  it('A selected dataset card will be unchecked when a new query is run.', () => {
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
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();

    let isFirstClick = true;

    cy.intercept('GET', 'query*', (req) => {
      if (isFirstClick) {
        isFirstClick = false;
        req.reply(protectedResponse1);
      } else {
        req.reply(protectedResponse2);
      }
    }).as('call');

    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001-checkbox"]')
      .find('input')
      .check();
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001-checkbox"]').should(
      'not.be.checked'
    );
  });
});
