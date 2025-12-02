import DownloadResultButton from '../../src/components/DownloadResultButton';

const props = {
  disabled: false,
  handleClick: () => {},
  loading: false,
};

describe('DownloadResultButton', () => {
  it('Displays an enabled MUI Download button and radio options', () => {
    cy.mount(
      <DownloadResultButton
        disabled={props.disabled}
        handleClick={props.handleClick}
        loading={props.loading}
      />
    );
    cy.get('[data-cy="download-results-button"]').should('be.visible');
    cy.get('[data-cy="download-results-button"]').should('not.be.disabled');
    cy.get('[data-cy="download-results-button"]').should('contain', 'Download');
    cy.get('[data-cy="download-radio-0"]').should('contain', 'Include term labels');
    cy.get('[data-cy="download-radio-1"]').should('contain', 'Include term URIs');
  });

  it('Calls handleClick(1) when "Include term URIs" is selected and Download clicked', () => {
    const handleClickSpy = cy.spy().as('handleClickSpy');
    cy.mount(
      <DownloadResultButton
        disabled={props.disabled}
        handleClick={handleClickSpy}
        loading={props.loading}
      />
    );

    cy.get('[data-cy="download-radio-1"]').click();
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('@handleClickSpy').should('have.been.calledWith', 1);
  });

  it('Calls handleClick(0) when default (labels) option is used', () => {
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

  it('Displays tooltip when disabled', () => {
    cy.mount(<DownloadResultButton disabled handleClick={props.handleClick} loading={false} />);

    cy.get('[data-cy="download-results-button"]').parent().trigger('mouseover', { force: true });
    cy.get('.MuiTooltip-tooltip').should('contain', 'Please select at least one dataset');
  });

  it('Shows spinner and disables button when loading is true', () => {
    cy.mount(<DownloadResultButton disabled={false} handleClick={props.handleClick} loading />);
    cy.get('[data-cy="download-results-button"]').should('be.disabled');
    cy.get('[data-cy="download-results-button"]').should(
      'contain',
      'Downloading selected query results'
    );
    cy.get('.MuiCircularProgress-root').should('be.visible');
  });
});
