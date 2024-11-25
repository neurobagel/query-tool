import GetDataDialog from '../../src/components/GetDataDialog';

const props = {
  open: true,
  onClose: () => {},
  disableDownloadResultsButton: false,
  handleDownloadResultButtonClick: () => {},
};

describe('GetDataDialog', () => {
  it('Displays a MUI Diaglog with content', () => {
    cy.mount(
      <GetDataDialog
        open={props.open}
        onClose={props.onClose}
        disableDownloadResultsButton={props.disableDownloadResultsButton}
        handleDownloadResultButtonClick={props.handleDownloadResultButtonClick}
      />
    );
    cy.get('[data-cy="get-data-dialog"]').should('be.visible');
    cy.get('[data-cy="cohort-participant-machine-download-results-button"]').should('be.visible');
    cy.get('[data-cy="get-data-dialog"] p').should(
      'contain',
      'The above command currently only gets data for DataLad datasets'
    );
    cy.get('[data-cy="cohort-participant-machine-download-results-button"]').should('be.visible');
  });
  it("Doesn't display the dialog when open prop is set to false", () => {
    cy.mount(
      <GetDataDialog
        open={false}
        onClose={props.onClose}
        disableDownloadResultsButton={props.disableDownloadResultsButton}
        handleDownloadResultButtonClick={props.handleDownloadResultButtonClick}
      />
    );
    cy.get('[data-cy="get-data-dialog"]').should('not.exist');
  });
  it('Fires onClose event handler when the close button is clicked', () => {
    const onCloseSpy = cy.spy().as('onCloseSpy');
    cy.mount(
      <GetDataDialog
        open={props.open}
        onClose={onCloseSpy}
        disableDownloadResultsButton={props.disableDownloadResultsButton}
        handleDownloadResultButtonClick={props.handleDownloadResultButtonClick}
      />
    );
    cy.get('[data-cy="get-data-dialog-close-button"]').click();
    cy.get('@onCloseSpy').should('have.been.called');
  });
  it('Fires handleDownloadResultButtonClick event handler when the download button is clicked', () => {
    const handleDownloadResultButtonClickSpy = cy.spy().as('handleDownloadResultButtonClickSpy');
    cy.mount(
      <GetDataDialog
        open={props.open}
        onClose={props.onClose}
        disableDownloadResultsButton={props.disableDownloadResultsButton}
        handleDownloadResultButtonClick={handleDownloadResultButtonClickSpy}
      />
    );
    cy.get('[data-cy="cohort-participant-machine-download-results-button"]').click();
    cy.get('@handleDownloadResultButtonClickSpy').should('have.been.called');
  });
});
