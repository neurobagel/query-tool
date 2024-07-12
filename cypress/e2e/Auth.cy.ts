// import { GoogleAuthResponse } from '../fixtures/mocked-responses';

// describe('Google Authentication', () => {
//   it('should login and logout using Google', () => {
//     cy.intercept(
//       {
//         method: 'POST',
//         url: 'play.google.com',
//       },
//       GoogleAuthResponse
//     ).as('getNodes');
//     cy.visit('/');
//     cy.get('[data-cy="auth-dialog"]').within(() => {
//       // Find the "Sign in with Google" button and click it
//       cy.contains('Sign in with Google').click();
//     });
//   });
// });

describe('Google', function () {
  beforeEach(function () {
    cy.loginByGoogleApi();
  });

  it('shows onboarding', function () {
    cy.contains('Get Started').should('be.visible');
  });
});
