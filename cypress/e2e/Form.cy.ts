describe('App', () => {
    it('Validates input to continuous field, displays the appropriate error, and disables the submit query button', () => {
      cy.visit('/');
      cy.get('[data-cy="submit-query-button"]').should('not.be.disabled');
      cy.get('[data-cy="Minimum age-continuous-field"]').type('some text');
      cy.get('[data-cy="Minimum age-continuous-field"] p').should('be.visible').should('contain', 'Please enter a valid number!');
      cy.get('[data-cy="submit-query-button"]').should('be.disabled');
      cy.get('[data-cy="Minimum age-continuous-field"] input').clear();
      cy.get('[data-cy="submit-query-button"]').should('not.be.disabled');
      cy.get('[data-cy="Minimum age-continuous-field"]').type('-10');
      cy.get('[data-cy="Minimum age-continuous-field"] p').should('be.visible').should('contain', 'Please enter a positive number!');
      cy.get('[data-cy="submit-query-button"]').should('be.disabled');
    });
    it("Disables the diagnosis field if healthy control checkbox is checked", () => {
      cy.intercept({
        method: 'GET',
        url: '/attributes/nb:Diagnosis',
      }).as('getDiagnosisOptions');
      cy.visit('/');
      cy.wait('@getDiagnosisOptions');
      cy.get('[data-cy="Diagnosis-categorical-field"] input').should('not.be.disabled');
      cy.get('[data-cy="Diagnosis-categorical-field"]').type('parkin{downarrow}{enter}');
      cy.get('[data-cy="Diagnosis-categorical-field"] input').should('have.value', 'Parkinson\'s disease');
      cy.get('[data-cy="healthy-control-checkbox"]').click();
      cy.get('[data-cy="Diagnosis-categorical-field"] input').should('be.disabled');
      cy.get('[data-cy="healthy-control-checkbox"]').click();
      cy.get('[data-cy="Diagnosis-categorical-field"] input').should('not.be.disabled');
      cy.get('[data-cy="Diagnosis-categorical-field"] input').should('have.value', 'Parkinson\'s disease');
    })
  });
  