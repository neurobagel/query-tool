import { mixedResponse, unprotectedResponse } from '../fixtures/mocked-responses';

describe('Results TSV', () => {
  it('Removes a newline character from a dataset name in the downloaded dataset-level results file', () => {
    cy.intercept('query/?*', mixedResponse).as('call');
    cy.visit('/');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="dataset-level-download-results-button"]').click();
    cy.readFile('cypress/downloads/dataset-level-results.tsv').should('contain', 'some cool name');
  });
  it('Removes the unwanted whitespace from the downloaded results files', () => {
    cy.intercept('query/?*', mixedResponse).as('call');
    cy.visit('/');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="dataset-level-download-results-button"]').click();
    cy.readFile('cypress/downloads/dataset-level-results.tsv').then((fileContent) => {
      expect(fileContent).to.match(/^DatasetID/);
    });
    cy.get('[data-cy="participant-level-download-results-button"]').click();
    cy.readFile('cypress/downloads/participant-level-results.tsv').then((fileContent) => {
      expect(fileContent).to.match(/^DatasetID/);
    });
  });
  it('Checks whether the protected and unprotected datasets are correctly identified', () => {
    cy.intercept('query/?*', mixedResponse).as('call');
    cy.visit('/');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="dataset-level-download-results-button"]').click();
    cy.get('[data-cy="participant-level-download-results-button"]').click();
    cy.readFile('cypress/downloads/participant-level-results.tsv').then((fileContent) => {
      const rows = fileContent.split('\n');

      const datasetProtected = rows[1];
      const datasetNotProtected = rows[3];

      expect(datasetProtected.split('\t')[7]).to.equal('protected');
      expect(datasetNotProtected.split('\t')[8]).to.equal('/ds004116/sub-300101');
    });
  });
  it('Checks whether the rows in the participant.tsv file generated according to session_type', () => {
    cy.intercept('query/?*', unprotectedResponse).as('call');
    cy.visit('/');
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="dataset-level-download-results-button"]').click();
    cy.get('[data-cy="participant-level-download-results-button"]').click();
    cy.readFile('cypress/downloads/participant-level-results.tsv').then((fileContent) => {
      const rows = fileContent.split('\n');

      const phenotypicSession = rows[1];
      const imagingSession = rows[2];

      expect(phenotypicSession.split('\t')[3]).to.equal(
        'http://neurobagel.org/vocab/PhenotypicSession'
      );
      expect(phenotypicSession.split('\t')[4]).to.equal('10.4');
      expect(phenotypicSession.split('\t')[5]).to.equal(
        'http://purl.bioontology.org/ontology/SNOMEDCT/248152002'
      );
      expect(phenotypicSession.split('\t')[6]).to.equal(
        'http://purl.bioontology.org/ontology/SNOMEDCT/370143000'
      );
      expect(phenotypicSession.split('\t')[7]).to.equal(
        'https://www.cognitiveatlas.org/task/id/trm_4f2419c4a1646'
      );
      expect(phenotypicSession.split('\t')[8]).to.equal('');
      expect(phenotypicSession.split('\t')[11]).to.equal('');

      expect(imagingSession.split('\t')[3]).to.equal('http://neurobagel.org/vocab/ImagingSession');
      expect(imagingSession.split('\t')[4]).to.equal('');
      expect(imagingSession.split('\t')[5]).to.equal('');
      expect(imagingSession.split('\t')[6]).to.equal('');
      expect(imagingSession.split('\t')[7]).to.equal('');
      expect(imagingSession.split('\t')[8]).to.equal('/ds004116/sub-300101');
      expect(imagingSession.split('\t')[11]).to.equal(
        'http://purl.org/nidash/nidm#FlowWeighted, http://purl.org/nidash/nidm#T2Weighted'
      );
    });
  });
});
