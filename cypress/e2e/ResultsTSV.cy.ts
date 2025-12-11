import {
  mixedResponse,
  mixedSubjectResponse,
  unprotectedResponse,
  unprotectedSubjectResponse,
  diagnosisOptions,
  assessmentToolOptions,
  pipelineOptions,
  pipelineVersionOptions,
  nodeOptions,
} from '../fixtures/mocked-responses';

function readLatestFile(pattern: string) {
  if (Cypress.platform === 'win32') {
    const psCmd = `powershell -NoProfile -Command "Get-ChildItem -Path '${pattern}' -File 2>$null | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName"`;
    return cy.exec(psCmd).then(({ stdout }) => {
      const file = stdout.trim();
      if (!file) throw new Error(`No file found for pattern: ${pattern}`);
      return cy.readFile(file);
    });
  }

  const bashCmd = `bash -lc "ls -t ${pattern} 2>/dev/null | head -n1"`;
  return cy.exec(bashCmd).then(({ stdout }) => {
    const file = stdout.trim();
    if (!file) throw new Error(`No file found for pattern: ${pattern}`);
    return cy.readFile(file);
  });
}

describe('Results TSV', () => {
  beforeEach(() => {
    cy.intercept('POST', '/datasets', (req) => {
      req.reply(mixedResponse);
    }).as('call');
    cy.intercept('POST', '/subjects', (req) => {
      req.reply(mixedSubjectResponse);
    }).as('subjectsCall');
    cy.intercept(
      {
        method: 'GET',
        url: '/nodes',
      },
      nodeOptions
    ).as('getNodes');
    cy.intercept(
      {
        method: 'GET',
        url: '/diagnoses',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/assessments',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/pipelines',
      },
      pipelineOptions
    ).as('getPipelineOptions');
    cy.intercept(
      {
        method: 'GET',
        url: 'pipelines/np:fmriprep/versions',
      },
      pipelineVersionOptions
    ).as('getPipelineVersionsOptions');
    cy.visit('/');
    cy.wait([
      '@getNodes',
      '@getDiagnosisOptions',
      '@getAssessmentToolOptions',
      '@getPipelineOptions',
    ]);
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
    cy.get('[data-cy="download-results-button"]').click();
    cy.wait('@subjectsCall');
    cy.get('[data-cy="download-results-dropdown-button"]').click();
    cy.contains('URIs').click();
    cy.get('[data-cy="download-results-button"]').click();
    cy.wait('@subjectsCall');
    readLatestFile('cypress/downloads/neurobagel-query-results-with-URIs-*.tsv').should(
      'contain',
      'some cool name'
    );
  });
  it('Removes the unwanted whitespace from the downloaded results files', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="download-results-button"]').click();
    cy.wait('@subjectsCall');
    readLatestFile('cypress/downloads/neurobagel-query-results-*.tsv').then((fileContent) => {
      expect(fileContent).to.match(/^DatasetName/);
    });
    cy.get('[data-cy="download-results-dropdown-button"]').click();
    cy.contains('URIs').click();
    cy.get('[data-cy="download-results-button"]').click();
    cy.wait('@subjectsCall');
    readLatestFile('cypress/downloads/neurobagel-query-results-with-URIs-*.tsv').then(
      (fileContent) => {
        expect(fileContent).to.match(/^DatasetName/);
      }
    );
  });
  it('Checks whether the protected and unprotected datasets are correctly identified', () => {
    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="download-results-button"]').click();
    cy.wait('@subjectsCall');
    readLatestFile('cypress/downloads/neurobagel-query-results-*.tsv').then((fileContent) => {
      const rows = fileContent.split('\n');

      const datasetProtected = rows[1];
      const datasetNotProtected = rows[3];

      expect(datasetProtected.split('\t')[7]).to.equal('protected');
      expect(datasetNotProtected.split('\t')[5]).to.equal('/ds004116/sub-300101');
    });
  });
});
describe('Unprotected response', () => {
  it('Checks whether the rows in the participant.tsv file generated according to session_type', () => {
    cy.intercept('POST', '/datasets', unprotectedResponse).as('call');
    cy.intercept('POST', '/subjects', unprotectedSubjectResponse).as('subjectsCall');
    cy.intercept(
      {
        method: 'GET',
        url: '/diagnoses',
      },
      diagnosisOptions
    ).as('getDiagnosisOptions');
    cy.intercept(
      {
        method: 'GET',
        url: '/assessments',
      },
      assessmentToolOptions
    ).as('getAssessmentToolOptions');
    cy.visit('/');
    cy.wait(['@getDiagnosisOptions', '@getAssessmentToolOptions']);
    // TODO: remove this
    // Bit of a hacky way to close the auth dialog
    // But we need to do it until we make auth an always-on feature
    // Because the auth dialog will overlap a lot of the UI and thus fail the tests
    cy.get('[data-cy="close-auth-dialog-button"]').click();

    cy.get('[data-cy="submit-query-button"]').click();
    cy.wait('@call');
    cy.get('[data-cy="select-all-checkbox"]').find('input').check();
    cy.get('[data-cy="download-results-button"]').click();
    cy.wait('@subjectsCall');

    readLatestFile('cypress/downloads/neurobagel-query-results-*.tsv').then((fileContent) => {
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
      expect(phenotypicSession.split('\t')[7]).to.equal('1');
      expect(phenotypicSession.split('\t')[8]).to.equal('0');
      expect(phenotypicSession.split('\t')[9]).to.equal('10.4');
      expect(phenotypicSession.split('\t')[10]).to.equal('female');
      expect(phenotypicSession.split('\t')[11]).to.equal('Major depressive disorder');
      expect(phenotypicSession.split('\t')[12]).to.equal('multisource interference task');
      expect(phenotypicSession.split('\t')[13]).to.equal('');
      expect(phenotypicSession.split('\t')[14]).to.equal('');
      expect(phenotypicSession.split('\t')[15]).to.equal('Functional MRI,T2 Weighted');
      expect(phenotypicSession.split('\t')[16]).to.equal('fmriprep 23.1.3,freesurfer 7.3.2');

      expect(imagingSession.split('\t')[0]).to.equal('some dataset');
      expect(imagingSession.split('\t')[1]).to.equal(
        'https://github.com/OpenNeuroDatasets-JSONLD/ds004116.git'
      );
      expect(imagingSession.split('\t')[2]).to.equal('2');
      expect(imagingSession.split('\t')[3]).to.equal('sub-300101');
      expect(imagingSession.split('\t')[4]).to.equal('ses-nb01');
      expect(imagingSession.split('\t')[5]).to.equal('/ds004116/sub-300101');
      expect(imagingSession.split('\t')[6]).to.equal('Imaging');
      expect(imagingSession.split('\t')[7]).to.equal('0');
      expect(imagingSession.split('\t')[8]).to.equal('1');
      expect(imagingSession.split('\t')[9]).to.equal('');
      expect(imagingSession.split('\t')[10]).to.equal('');
      expect(imagingSession.split('\t')[11]).to.equal('');
      expect(imagingSession.split('\t')[12]).to.equal('');
      expect(imagingSession.split('\t')[13]).to.equal('Functional MRI,T2 Weighted');
      expect(imagingSession.split('\t')[14]).to.equal('fmriprep 23.1.3,freesurfer 7.3.2');
      expect(imagingSession.split('\t')[15]).to.equal('Functional MRI,T2 Weighted');
      expect(imagingSession.split('\t')[16]).to.equal('fmriprep 23.1.3,freesurfer 7.3.2');
    });
  });
});
