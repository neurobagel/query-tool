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
    cy.get('[data-cy="how-to-get-data-dialog-button"]').click();
    cy.get('[data-cy="cohort participant machine-download-results-button"]').click();
    cy.readFile('cypress/downloads/cohort participant machine results.tsv').should(
      'contain',
      'some cool name'
    );
  });
  it('Removes the unwanted whitespace from the downloaded results files', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="cohort participant-download-results-button"]').click();
    cy.readFile('cypress/downloads/cohort participant results.tsv').then((fileContent) => {
      expect(fileContent).to.match(/^DatasetName/);
    });
    cy.get('[data-cy="how-to-get-data-dialog-button"]').click();
    cy.get('[data-cy="cohort participant machine-download-results-button"]').click();
    cy.readFile('cypress/downloads/cohort participant machine results.tsv').then((fileContent) => {
      expect(fileContent).to.match(/^DatasetName/);
    });
  });
  it('Checks whether the protected and unprotected datasets are correctly identified', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="cohort participant-download-results-button"]').click();
    cy.get('[data-cy="how-to-get-data-dialog-button"]').click();
    cy.get('[data-cy="cohort participant machine-download-results-button"]').click();
    cy.readFile('cypress/downloads/cohort participant results.tsv').then((fileContent) => {
      const rows = fileContent.split('\n');

      const datasetProtected = rows[1];
      const datasetNotProtected = rows[3];

      expect(datasetProtected.split('\t')[7]).to.equal('protected');
      expect(datasetNotProtected.split('\t')[5]).to.equal('/ds004116/sub-300101');
    });
  });
});
describe('Unprotected response', () => {
  it.only('Checks whether the rows in the participant.tsv file generated according to session_type', () => {
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
    cy.get('[data-cy="cohort participant-download-results-button"]').click();
    cy.get('[data-cy="how-to-get-data-dialog-button"]').click();
    cy.get('[data-cy="cohort participant machine-download-results-button"]').click();

    cy.readFile('cypress/downloads/cohort participant results.tsv').then((fileContent) => {
      const rows = fileContent.split('\n');

      const phenotypicSession = rows[1];
      const imagingSession = rows[2];

      expect(phenotypicSession.split('\t')[0]).to.equal('some dataset');
      expect(phenotypicSession.split('\t')[1]).to.equal(
        'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git'
      );
      expect(phenotypicSession.split('\t')[2]).to.equal('2');
      expect(phenotypicSession.split('\t')[3]).to.equal('sub-300100');
      expect(phenotypicSession.split('\t')[4]).to.equal('ses-nb01');
      expect(phenotypicSession.split('\t')[5]).to.equal('');
      expect(phenotypicSession.split('\t')[6]).to.equal('Phenotypic');
      expect(phenotypicSession.split('\t')[7]).to.equal('10.4');
      expect(phenotypicSession.split('\t')[8]).to.equal('female');
      expect(phenotypicSession.split('\t')[9]).to.equal('Major depressive disorder');
      expect(phenotypicSession.split('\t')[10]).to.equal('multisource interference task');
      expect(phenotypicSession.split('\t')[11]).to.equal('1');
      expect(phenotypicSession.split('\t')[12]).to.equal('0');
      expect(phenotypicSession.split('\t')[13]).to.equal('');
      expect(phenotypicSession.split('\t')[14]).to.equal('');
      expect(phenotypicSession.split('\t')[15]).to.equal('Flow Weighted, T2 Weighted');
      expect(phenotypicSession.split('\t')[16]).to.equal('fmriprep 23.1.3, freesurfer 7.3.2');

      expect(imagingSession.split('\t')[0]).to.equal('some dataset');
      expect(imagingSession.split('\t')[1]).to.equal(
        'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git'
      );
      expect(imagingSession.split('\t')[2]).to.equal('2');
      expect(imagingSession.split('\t')[3]).to.equal('sub-300101');
      expect(imagingSession.split('\t')[4]).to.equal('ses-nb01');
      expect(imagingSession.split('\t')[5]).to.equal('/ds004116/sub-300101');
      expect(imagingSession.split('\t')[6]).to.equal('Imaging');
      expect(imagingSession.split('\t')[7]).to.equal('');
      expect(imagingSession.split('\t')[8]).to.equal('');
      expect(imagingSession.split('\t')[9]).to.equal('');
      expect(imagingSession.split('\t')[10]).to.equal('');
      expect(imagingSession.split('\t')[11]).to.equal('0');
      expect(imagingSession.split('\t')[12]).to.equal('1');
      expect(imagingSession.split('\t')[13]).to.equal('Flow Weighted, T2 Weighted');
      expect(imagingSession.split('\t')[14]).to.equal('fmriprep 23.1.3, freesurfer 7.3.2');
      expect(imagingSession.split('\t')[15]).to.equal('Flow Weighted, T2 Weighted');
      expect(imagingSession.split('\t')[16]).to.equal('fmriprep 23.1.3, freesurfer 7.3.2');
    });
  });
});
