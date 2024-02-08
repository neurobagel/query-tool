describe('Alert', () => {
    it('Correctly displays and dismisses the alert', () => {
      cy.intercept({
        method: 'GET',
        url: '/nodes/',
      }).as('getNodes');
      cy.visit('/?node=All');
      // We need to wait for the fetch to complete and populate the
      // dropdown with nodes before searching for OpenNeuro
      cy.wait('@getNodes');
      cy.get('[data-cy="openneuro-alert"]').should('be.visible').should('contain', 'The OpenNeuro node is being actively annotated at the participant');
      cy.get('[data-cy="Neurobagel graph-categorical-field"]').type('Quebec Parkinson Network{downarrow}{enter}');
      cy.get('[data-cy="openneuro-alert"]').should('not.exist');
      cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('not.contain', 'All');
      cy.get('[data-cy="Neurobagel graph-categorical-field"]').find('[data-testid="CloseIcon"]').click();
      cy.get('[data-cy="Neurobagel graph-categorical-field"]').should('contain', 'All');
      cy.get('[data-cy="Neurobagel graph-categorical-field"]').type('OpenNeuro{downarrow}{enter}');
      cy.get('[data-cy="openneuro-alert"]').should('be.visible');
      cy.get('[data-cy="openneuro-alert"]').find('[data-testid="CloseIcon"]').click();
      cy.get('[data-cy="openneuro-alert"]').should('not.exist');
    });
  });
  