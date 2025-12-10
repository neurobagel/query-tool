describe('Feedback', () => {
  it('Displays and closes small screen size dialog', () => {
    cy.viewport(766, 500);
    cy.visit('/');
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();
    cy.get('[data-cy="small-screen-size-dialog"]').should('be.visible');
    cy.get('[data-cy="close-small-screen-size-dialog-button"]').click();
    cy.get('[data-cy="small-screen-size-dialog"]').should('not.exist');
  });
});
