import ResultContainer from '../../src/components/ResultContainer';
import type { QueryParams, SubjectsResponse } from '../../src/utils/types';
import { protectedResponse2, responseWithUnknownModality } from '../fixtures/mocked-responses';

const emptySubjectsResponse: SubjectsResponse = {
  responses: [],
  errors: [],
  nodes_response_status: 'success',
};

const mockOnDownload = async () => emptySubjectsResponse;
const mockQueryParams: QueryParams = { nodes: [] };

describe('ResultContainer', () => {
  it('Displays a set of Result Cards, select all checkbox, a disabled download result button, summary stats, and how to get data dialog button', () => {
    cy.mount(
      <ResultContainer
        response={protectedResponse2}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={mockQueryParams}
        disableDownloads={false}
        onDownload={mockOnDownload}
      />
    );
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001"]').should('be.visible');
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0002"]').should('be.visible');
    cy.get('[data-cy="select-all-checkbox"]').should('be.visible');
    cy.get('[data-cy="summary-stats"]')
      .should('be.visible')
      .should('contain', 'Summary stats: 2 datasets, 4 subjects');
    cy.get('[data-cy="download-results-button"]').should('be.visible').should('be.disabled');
  });
  it('Selecting a dataset should enable the download result button', () => {
    cy.mount(
      <ResultContainer
        response={protectedResponse2}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={mockQueryParams}
        disableDownloads={false}
        onDownload={mockOnDownload}
      />
    );
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001-checkbox"] input').check();
    cy.get('[data-cy="download-results-button"]').should('be.visible').should('not.be.disabled');
  });
  it('Selecting/unselecting select all datasets checkbox should check/uncheck all dataset cards', () => {
    cy.mount(
      <ResultContainer
        response={protectedResponse2}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={mockQueryParams}
        disableDownloads={false}
        onDownload={mockOnDownload}
      />
    );
    cy.get('[data-cy="select-all-checkbox"] input').check();
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001-checkbox"] input').should(
      'be.checked'
    );
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0002-checkbox"] input').should(
      'be.checked'
    );
    cy.get('[data-cy="select-all-checkbox"] input').uncheck();
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0002-checkbox"] input').should(
      'not.be.checked'
    );
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0002-checkbox"] input').should(
      'not.be.checked'
    );
  });
  it('Shows no result view when result is empty', () => {
    cy.mount(
      <ResultContainer
        response={{ responses: [], errors: [], nodes_response_status: 'success' }}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={mockQueryParams}
        disableDownloads={false}
        onDownload={mockOnDownload}
      />
    );
    cy.get('[data-cy="empty-result-container-view"]')
      .should('be.visible')
      .should('contain', 'No results');
  });
  it('Shows Click Submit Query view when result is null', () => {
    cy.mount(
      <ResultContainer
        response={null}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={null}
        disableDownloads={false}
        onDownload={mockOnDownload}
      />
    );
    cy.get('[data-cy="default-result-container-view"]')
      .should('be.visible')
      .should('contain', "Click 'Submit Query' for results");
  });
  it('Handles unknown modalities gracefully without breaking', () => {
    cy.mount(
      <ResultContainer
        response={responseWithUnknownModality}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={mockQueryParams}
        disableDownloads={false}
        onDownload={mockOnDownload}
      />
    );
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0003"]').should('be.visible');
    cy.get('[data-cy="modality-buttons"]').within(() => {
      // Should show only one button (T1) button, and not the unknown modality
      cy.contains('button', 'T1').should('be.visible');
      cy.get('button').should('have.length', 1);
    });
  });
  it('Fires the onDownload event handler with the appropriate payload when the download results button is clicked', () => {
    const onDownloadSpy = cy.spy().as('onDownloadSpy');
    cy.mount(
      <ResultContainer
        response={protectedResponse2}
        assessmentOptions={[]}
        diagnosisOptions={[]}
        queryForm={mockQueryParams}
        disableDownloads={false}
        onDownload={onDownloadSpy}
      />
    );
    cy.get('[data-cy="card-https://someportal.org/datasets/ds0001-checkbox"] input').check();
    cy.get('[data-cy="download-results-button"]').click();
    cy.get('@onDownloadSpy').should('have.been.calledWith', 0, [
      'https://someportal.org/datasets/ds0001',
    ]);
  });
});
