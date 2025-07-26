import ErrorAlert from '../../src/components/ErrorAlert';
import { failedQueryResponse } from '../fixtures/mocked-responses';

const errorTitle = 'errorTitle';
const explanation = 'something went wrong.';
const errorMessage = JSON.stringify(failedQueryResponse, null, 2);

describe('ErrorAlert', () => {
  it('Displays the error title and message', () => {
    cy.mount(
      <ErrorAlert
        errorTitle={errorTitle}
        errorExplanation={explanation}
        errorContent={errorMessage}
      />
    );
    cy.get('[data-cy="error-alert"]').contains(errorTitle);
    cy.get('[data-cy="error-container"]').contains(errorMessage);
  });

  it('Works if no error message is provided', () => {
    cy.mount(<ErrorAlert errorTitle={errorTitle} errorExplanation={explanation} />);
    cy.get('[data-cy="error-alert"]').contains(errorTitle);
    cy.get('[data-cy="error-alert"]').should('not.contain', errorMessage);
    cy.get('[data-cy="error-alert"]').contains(explanation);
  });

  it('Starts scrolling for long error messages', () => {
    cy.mount(
      <ErrorAlert
        errorTitle={errorTitle}
        errorExplanation={explanation}
        errorContent={errorMessage.repeat(5)}
      />
    );
    cy.get('[data-cy="error-alert"]').contains(errorTitle);
    cy.get('[data-cy="error-container"]').contains(errorMessage);

    cy.get('[data-cy="error-container"]').should('have.css', 'overflow', 'auto');

    cy.get('[data-cy="error-container"]').then(($el) => {
      const element = $el[0];
      expect(element.scrollHeight).to.be.greaterThan(element.clientHeight);
    });

    // Verify we can scroll by checking scroll position changes
    cy.get('[data-cy="error-container"]').scrollTo('bottom');
    cy.get('[data-cy="error-container"]').then(($el) => {
      expect($el[0].scrollTop).to.be.greaterThan(0);
    });
  });
});
