import DownloadResultButton from '../../src/components/DownloadResultButton';

const props = {
  disabled: false,
  handleClick: () => {},
  loading: false,
};

describe('DownloadResultButton', () => {
  it('Displays an enabled MUI Button', () => {
    cy.mount(
      <DownloadResultButton
        disabled={props.disabled}
        handleClick={props.handleClick}
        loading={props.loading}
      />
    );
    cy.get('[data-cy="download-results-button"]').should('be.visible');
    cy.get('[data-cy="download-results-button"]').should('contain', 'Download');
    cy.get('[data-cy="download-results-button"]').should('not.be.disabled');
  });

  it('Calls handleClick with the selected radio index', () => {
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
    cy.get('[data-cy="download-radio-1"]').click();
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('@handleClickSpy').should('have.been.calledWith', 1);
  });

  it('Shows tooltip when disabled and hovered', () => {
    cy.mount(<DownloadResultButton disabled handleClick={props.handleClick} loading={false} />);
    cy.get('[data-cy="download-results-button"]').trigger('mouseover', { force: true });
    cy.get('.MuiTooltip-tooltip')
      .should('be.visible')
      .should('contain', 'Please select at least one dataset');
  });

  it('Shows loading spinner and disables button when loading', () => {
    cy.mount(
      <DownloadResultButton disabled={props.disabled} handleClick={props.handleClick} loading />
    );
    cy.get('[data-cy="download-results-button"]').should('be.disabled');
    cy.contains('Downloading...').should('exist');
    cy.get('.MuiCircularProgress-root').should('be.visible');
  });
});
