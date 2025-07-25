import ErrorAlert from '../../src/components/ErrorAlert';

describe('ErrorAlert', () => {
  it('Render', () => {
    cy.mount(<ErrorAlert />);
  });
});
