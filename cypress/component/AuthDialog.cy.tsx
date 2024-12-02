import AuthDialog from '../../src/components/AuthDialog';

describe('AuthDialog', () => {
  it('Displays a MUI dialog with the title and "sing in with google" button', () => {
    cy.mount(<AuthDialog open onClose={() => {}} />);
    cy.get('[data-cy="auth-dialog"]').should('be.visible');
    cy.get('[data-cy="auth-dialog"]').should('contain', 'You must log in');
    cy.get('[data-cy="auth-dialog"]').within(() => {
      cy.contains('Neurobagel');
    });
    cy.get('[data-cy="close-auth-dialog-button"]').should('be.visible');
  });
});
