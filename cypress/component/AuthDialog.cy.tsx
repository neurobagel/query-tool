import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthDialog from '../../src/components/AuthDialog';

const props = {
  onAuth: () => {},
  onClose: () => {},
};

describe('ContinuousField', () => {
  it('Displays a MUI dialog with the title and "sing in with google" button', () => {
    cy.mount(
      <GoogleOAuthProvider clientId="mock-client-id">
        <AuthDialog open onClose={props.onClose} onAuth={props.onAuth} />
      </GoogleOAuthProvider>
    );
    cy.get('[data-cy="auth-dialog"]').should('be.visible');
    cy.get('[data-cy="auth-dialog"]').should('contain', 'You must log in');
    cy.get('[data-cy="auth-dialog"]').within(() => {
      cy.contains('Google');
    });
    cy.get('[data-cy="close-auth-dialog-button"]').should('be.visible');
  });
});
