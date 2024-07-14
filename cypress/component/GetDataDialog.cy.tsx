import GetDataDialog from '../../src/components/GetDataDialog';

const props = {
  open: true,
  onClose: () => {},
};

describe('GetDataDialog', () => {
  it('Displays a MUI Diaglog with the title and content', () => {
    cy.mount(<GetDataDialog open={props.open} onClose={props.onClose} />);
    cy.get('[data-cy="get-data-dialog"]').should('be.visible');
    cy.get('[data-cy="get-data-dialog"] h2').should('contain', 'Example usage');
    cy.get('[data-cy="get-data-dialog"] p').should(
      'contain',
      'The command for automatically getting the data currently only applies to datasets available through datalad.'
    );
  });
  it("Doesn't display the dialog when open prop is set to false", () => {
    cy.mount(<GetDataDialog open={false} onClose={props.onClose} />);
    cy.get('[data-cy="get-data-dialog"]').should('not.exist');
  });
  it('Fires onClose event handler when the close button is clicked', () => {
    const onCloseSpy = cy.spy().as('onCloseSpy');
    cy.mount(<GetDataDialog open={props.open} onClose={onCloseSpy} />);
    cy.get('[data-cy="get-data-dialog"] button').click();
    cy.get('@onCloseSpy').should('have.been.called');
  });
});
