import DownloadResultButton from '../../src/components/DownloadResultButton';

const props = {
  disabled: false,
  handleClick: () => {},
  loading: false,
};

describe('DownloadResultButton', () => {
  it('Displays an enabled MUI Button with the identifier passed as prop', () => {
    cy.mount(
      <DownloadResultButton
        disabled={props.disabled}
        handleClick={props.handleClick}
        loading={props.loading}
      />
    );
    cy.get('[data-cy="download-results-button"]').should('be.visible');
    cy.get('[data-cy="download-results-button"]').should(
      'contain',
      'Download selected query results'
    );
    cy.get('[data-cy="download-results-button"]').should('not.be', 'disabled');
  });
  it('Fires the handleClick event handler with the appropriate payload when the button is clicked', () => {
    const handleClickSpy = cy.spy().as('handleClickSpy');
    cy.mount(
      <DownloadResultButton
        disabled={props.disabled}
        handleClick={handleClickSpy}
        loading={props.loading}
      />
    );
    cy.get('[data-cy="download-results-dropdown-button"]').click();
    cy.contains('URIs').click();
    cy.get('[data-cy="download-results-button"]').should(
      'contain',
      'Download selected query results with URIs'
    );
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('@handleClickSpy').should('have.been.calledWith', 1);
    cy.get('[data-cy="download-results-dropdown-button"]').click();
    cy.contains(/results$/).click();
    cy.get('[data-cy="download-results-button"]')
      .invoke('text')
      .should('match', /^Download selected query results$/);
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('@handleClickSpy').should('have.been.calledWith', 0);
  });
  it('Displays a disabled MUI Button and a tooltip when the button is hovered over', () => {
    cy.mount(<DownloadResultButton disabled handleClick={props.handleClick} loading={false} />);
    cy.get('[data-cy="download-results-button"]').trigger('mouseover', { force: true });
    cy.get('.MuiTooltip-tooltip').should('contain', 'Please select at least one dataset');
  });
  it('Fires the handleClick event handler with the appropriate payload when the button is clicked', () => {
    const handleClickSpy = cy.spy().as('handleClickSpy');
    cy.mount(
      <DownloadResultButton
        disabled={props.disabled}
        handleClick={handleClickSpy}
        loading={props.loading}
      />
    );
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('@handleClickSpy').should('have.been.calledWith', 0);
  });
  it('Disables the button and displays a loading spinner when loading is true', () => {
    cy.mount(
      <DownloadResultButton disabled={props.disabled} handleClick={props.handleClick} loading />
    );
    cy.get('[data-cy="download-results-button"]').should('be.disabled');
    cy.get('[data-cy="download-results-button"]').should(
      'contain',
      'Downloading selected query results'
    );
    cy.get('.MuiCircularProgress-root').should('be.visible');
  });
});
