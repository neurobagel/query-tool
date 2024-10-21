import { nodeOptions, diagnosisOptions, assessmentToolOptions } from '../fixtures/mocked-responses';

describe('Authentication flow', () => {
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
        url: '/assessments',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait(['@getNodes', '@getDiagnosisOptions', '@getAssessmentToolOptions']);
  });
  it('Auth dialog is visible by default and user is not logged in', () => {
    cy.visit('/');
    cy.get('[data-cy="auth-dialog"]').should('exist');
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('[data-cy="auth-dialog"]').should('not.exist');
    cy.get('.MuiAvatar-root').click();
    cy.get('[data-cy="login-button"]').should('exist');
  });
  it('Auth dialog can be opened and closed', () => {
    cy.visit('/');
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('.MuiAvatar-root').click();
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="auth-dialog"]').should('be.visible');
    cy.get('[data-cy="close-auth-dialog-button"]').should('be.visible');
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('[data-cy="auth-dialog"]').should('not.exist');
  });
});
