import { mixedResponse, unprotectedResponse } from '../fixtures/mocked-responses';

describe('Results TSV', () => {
  beforeEach(() => {
    cy.intercept('GET', 'query*', (req) => {
      req.reply(mixedResponse);
    }).as('call');
    cy.visit('/');
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();
  });
  it('Removes a newline character from a dataset name in the downloaded dataset-level results file', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="dataset-level-download-results-button"]').click();
    cy.readFile('cypress/downloads/dataset-level-results.tsv').should('contain', 'some cool name');
  });
  it('Removes the unwanted whitespace from the downloaded results files', () => {
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
});
describe('Unprotected response', () => {
  it('Checks whether the rows in the participant.tsv file generated according to session_type', () => {
    cy.intercept('query?*', unprotectedResponse).as('call');
    cy.visit('/');
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();

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
      expect(imagingSession.split('\t')[12]).to.equal(
        'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/fmriprep 23.1.3, https://github.com/nipoppy/pipeline-catalog/tree/main/processing/freesurfer 7.3.2'
      );
    });
  });
});
