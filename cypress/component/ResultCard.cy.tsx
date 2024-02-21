import ResultCard from '../../src/components/ResultCard';

const props = {
  nodeName: 'some node name',
  datasetUUID: 'some uuid',
  datasetName: 'some dataset name',
  datasetTotalSubjects: 10,
  numMatchingSubjects: 5,
  imageModals: [
    'http://purl.org/nidash/nidm#ArterialSpinLabeling',
    'http://purl.org/nidash/nidm#DiffusionWeighted',
  ],
  checked: true,
  onCheckboxChange: () => {},
};

describe('ResultCard', () => {
  it('Displays a MUI card with node name, dataset name, number of matched subjects, total number of subjects, and a checkbox', () => {
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUUID={props.datasetUUID}
        datasetName={props.datasetName}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        imageModals={props.imageModals}
        checked={props.checked}
        onCheckboxChange={props.onCheckboxChange}
      />
    );
    cy.get('[data-cy="card-some uuid"]').should('be.visible');
    cy.get('[data-cy="card-some uuid"]').should('contain', 'some dataset name');
    cy.get('[data-cy="card-some uuid"]').should('contain', 'from some node name');
    cy.get('[data-cy="card-some uuid"]').should('contain', '5 subjects match / 10 total subjects');
    cy.get('[data-cy="card-some uuid-checkbox"] input').should('be.checked');
    cy.get('[data-cy="card-some uuid"] button')
      .should('contain', 'ASL')
      .should('have.class', 'bg-zinc-800');
    cy.get('[data-cy="card-some uuid"] button')
      .eq(1)
      .should('contain', 'DWI')
      .should('have.class', 'bg-red-700');
  });
  it('Fires onCheckboxChange event handler with the appropriate payload when the checkbox is clicked', () => {
    const onCheckboxChange = cy.spy().as('onCheckboxChange');
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUUID={props.datasetUUID}
        datasetName={props.datasetName}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        imageModals={props.imageModals}
        checked={false}
        onCheckboxChange={onCheckboxChange}
      />
    );
    cy.get('[data-cy="card-some uuid-checkbox"] input').check();
    cy.get('@onCheckboxChange').should('have.been.calledWith', props.datasetUUID);
  });
});
