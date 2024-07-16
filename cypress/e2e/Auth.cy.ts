describe('Authentication flow', () => {
  it('Auth dialog is not visible by default and user is not logged in', () => {
    cy.visit('/');
    cy.get('[data-cy="auth-dialog"]').should('not.exist');
    cy.get('.MuiAvatar-root').click();
    cy.get('[data-cy="login-button"]').should('exist');
  });
  it('Auth dialog can be opened and closed', () => {
    cy.visit('/');
    cy.get('.MuiAvatar-root').click();
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="auth-dialog"]').should('be.visible');
    cy.get('[data-cy="close-auth-dialog-button"]').should('be.visible');
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('[data-cy="auth-dialog"]').should('not.exist');
  });
});
