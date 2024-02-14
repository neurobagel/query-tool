import { protectedResponse1, protectedResponse2 } from '../fixtures/mocked-responses';

describe('Dataset result checkbox', () => {
  it('A selected dataset card will be uncheckd when a new query is run.', () => {
    let isFirstClick = true;

    cy.intercept('GET', 'query/*', (req) => {
      if (isFirstClick) {
        isFirstClick = false;
        req.reply(protectedResponse1);
      } else {
        req.reply(protectedResponse2);
      }
    }).as('call');

    cy.visit('/');
    cy.get('[data-cy="submit-query"]').click();
    cy.wait('@call');
    cy.get('[data-cy="card-http://neurobagel.org/vocab/cool-dataset-checkbox"]').find('input').check();
    cy.get('[data-cy="submit-query"]').click();
    cy.wait('@call');
    cy.get('[data-cy="card-http://neurobagel.org/vocab/cool-dataset-checkbox"]').should('not.be.checked');
  });
});
