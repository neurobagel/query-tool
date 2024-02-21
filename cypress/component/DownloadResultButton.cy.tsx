import DownloadResultButton from '../../src/components/DownloadResultButton';

const props = {
  identifier: 'test',
  disabled: false,
  handleClick: () => {},
};

describe('DownloadResultButton', () => {
  it('Displays an enabled MUI Button with the identifier passed as prop', () => {
    cy.mount(
      <DownloadResultButton
        identifier={props.identifier}
        disabled={props.disabled}
        handleClick={props.handleClick}
      />
    );
    cy.get('[data-cy="test-download-results-button"]').should('be.visible');
    cy.get('[data-cy="test-download-results-button"]').should('contain', 'Download test Result');
    cy.get('[data-cy="test-download-results-button"]').should('not.be', 'disabled');
  });
  it('Displays a disabled MUI Button and a tooltip when the button is hovered over', () => {
    cy.mount(
      <DownloadResultButton
        identifier={props.identifier}
        disabled
        handleClick={props.handleClick}
      />
    );
    cy.get('[data-cy="test-download-results-button"]').trigger('mouseover', { force: true });
    cy.get('.MuiTooltip-tooltip').should('contain', 'Please select at least one dataset');
  });
  it('Fires the handleClick event handler with the appropriate payload when the button is clicked', () => {
    const handleClick = cy.spy().as('handleClick');
    cy.mount(
      <DownloadResultButton
        identifier={props.identifier}
        disabled={props.disabled}
        handleClick={handleClick}
      />
    );
    cy.get('[data-cy="test-download-results-button"]').click();
    cy.get('@handleClick').should('have.been.calledWith', 'test');
  });
});
