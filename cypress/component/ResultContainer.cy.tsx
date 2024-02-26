import ResultContainer from '../../src/components/ResultContainer';
import { protectedResponse2 } from '../fixtures/mocked-responses';

describe('ResultContainer', () => {
  it('Displays a set of Result Cards, select all checkbox, disabled download result buttons, summary stats, and how to get data modal button', () => {
    cy.mount(<ResultContainer result={protectedResponse2} />);
    cy.get('[data-cy="card-http://neurobagel.org/vocab/cool-dataset"]').should('be.visible');
    cy.get('[data-cy="card-http://neurobagel.org/vocab/not-so-cool-dataset"]').should('be.visible');
    cy.get('[data-cy="select-all-checkbox"]').should('be.visible');
    cy.get('[data-cy="summary-stats"]')
      .should('be.visible')
      .should('contain', 'Summary stats: 2 datasets, 4 subjects');
    cy.get('[data-cy="participant-level-download-results-button"]')
      .should('be.visible')
      .should('be.disabled');
    cy.get('[data-cy="dataset-level-download-results-button"]')
      .should('be.visible')
      .should('be.disabled');
    cy.get('[data-cy="how-to-get-data-modal-button"]').should('be.visible');
  });
  it('Selecting a dataset should enable the download result buttons', () => {
    cy.mount(<ResultContainer result={protectedResponse2} />);
    cy.get('[data-cy="card-http://neurobagel.org/vocab/cool-dataset-checkbox"] input').check();
    cy.get('[data-cy="participant-level-download-results-button"]')
      .should('be.visible')
      .should('not.be.disabled');
    cy.get('[data-cy="dataset-level-download-results-button"]')
      .should('be.visible')
      .should('not.be.disabled');
  });
  it('Selecting/unselecting select all datasets checkbox should check/uncheck all dataset cards', () => {
    cy.mount(<ResultContainer result={protectedResponse2} />);
    cy.get('[data-cy="select-all-checkbox"] input').check();
    cy.get('[data-cy="card-http://neurobagel.org/vocab/cool-dataset-checkbox"] input').should(
      'be.checked'
    );
    cy.get(
      '[data-cy="card-http://neurobagel.org/vocab/not-so-cool-dataset-checkbox"] input'
    ).should('be.checked');
    cy.get('[data-cy="select-all-checkbox"] input').uncheck();
    cy.get('[data-cy="card-http://neurobagel.org/vocab/cool-dataset-checkbox"] input').should(
      'not.be.checked'
    );
    cy.get(
      '[data-cy="card-http://neurobagel.org/vocab/not-so-cool-dataset-checkbox"] input'
    ).should('not.be.checked');
  });
  it('Clicking the how to get data modal button should open the modal', () => {
    cy.mount(<ResultContainer result={protectedResponse2} />);
    cy.get('[data-cy="nb-dialog"]').should('not.exist');
    cy.get('[data-cy="how-to-get-data-modal-button"]').click();
    cy.get('[data-cy="nb-dialog"]').should('be.visible');
  });
  it('Shows no result view when result is empty', () => {
    cy.mount(<ResultContainer result={[]} />);
    cy.get('[data-cy="empty-result-container-view"]')
      .should('be.visible')
      .should('contain', 'No results');
  });
  it('Shows Click Submit Query view when result is null', () => {
    cy.mount(<ResultContainer result={null} />);
    cy.get('[data-cy="default-result-container-view"]')
      .should('be.visible')
      .should('contain', "Click 'Submit Query' for results");
  });
});
