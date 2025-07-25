import ErrorAlert from '../../src/components/ErrorAlert';

const errorTitle = 'errorTitle';
const errorMessage = 'errorMessage';

describe('ErrorAlert', () => {
  it('Render', () => {
    cy.mount(<ErrorAlert errorTitle={errorTitle} errorMessage={errorMessage} />);
    cy.get('[data-cy="error-alert"]').contains(errorTitle);
    cy.get('[data-cy="error-alert"]').contains(errorMessage);
  });
});
