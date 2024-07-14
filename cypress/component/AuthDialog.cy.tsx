import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthDialog from '../../src/components/AuthDialog';

const props = {
  isLoggedIn: false,
  onAuth: () => {},
};

describe('ContinuousField', () => {
  it('Displays a MUI dialog with the title and "sing in with google" button', () => {
    cy.mount(
      <GoogleOAuthProvider clientId="mock-client-id">
        {' '}
        <AuthDialog isLoggedIn={props.isLoggedIn} onAuth={props.onAuth} />
      </GoogleOAuthProvider>
    );
    cy.get('[data-cy="auth-dialog"]').should('be.visible');
    cy.get('[data-cy="auth-dialog"]').should('contain', 'You must log in');
    cy.get('[data-cy="auth-dialog"]').within(() => {
      cy.contains('Google');
    });
  });
});
