import ErrorAlert from '../../src/components/ErrorAlert';
import { failedQueryResponse } from '../fixtures/mocked-responses';

const errorTitle = 'errorTitle';
const errorMessage = JSON.stringify(failedQueryResponse, null, 2);

describe('ErrorAlert', () => {
  it('Render', () => {
    cy.mount(<ErrorAlert errorTitle={errorTitle} errorMessage={errorMessage} />);
    cy.get('[data-cy="error-alert"]').contains(errorTitle);
    cy.get('[data-cy="error-alert"]').contains(errorMessage);
  });
});
