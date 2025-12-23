import ResultCard from '../../src/components/ResultCard';

const props = {
  nodeName: 'some node name',
  datasetUUID: 'some uuid',
  datasetName: 'some dataset name',
  datasetPortalURI: 'some portal uri',
  datasetTotalSubjects: 10,
  numMatchingSubjects: 5,
  imageModals: [
    'http://purl.org/nidash/nidm#ArterialSpinLabeling',
    'http://purl.org/nidash/nidm#DiffusionWeighted',
  ],
  pipelines: {
    'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/fmriprep': [
      '0.2.3',
      '23.1.3',
    ],
  },
  imagingModalitiesMetadata: {
    'http://purl.org/nidash/nidm#ArterialSpinLabeling': {
      TermURL: 'nidm:ArterialSpinLabeling',
      Label: 'Arterial Spin Labeling',
      Abbreviation: 'ASL',
      DataType: 'anat',
    },
    'http://purl.org/nidash/nidm#DiffusionWeighted': {
      TermURL: 'nidm:DiffusionWeighted',
      Label: 'Diffusion Weighted',
      Abbreviation: 'DWI',
      DataType: 'dwi',
    },
  },
  checked: true,
  onCheckboxChange: () => {},
};

describe('ResultCard', () => {
  it('Displays a MUI card with node name, dataset name, number of matched subjects, total number of subjects, available pipelines, and a checkbox', () => {
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUUID={props.datasetUUID}
        datasetName={props.datasetName}
        datasetPortalURI={props.datasetPortalURI}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        imageModals={props.imageModals}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        pipelines={props.pipelines}
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
      .eq(1)
      .should('contain', 'ASL')
      .should('have.css', 'background-color', 'rgb(113, 113, 122)');
    cy.get('[data-cy="card-some uuid"] button')
      .eq(2)
      .should('contain', 'DWI')
      .should('have.css', 'background-color', 'rgb(253, 164, 164)');

    cy.get('[data-cy="card-some uuid-available-pipelines-button"]').trigger('mouseover', {
      force: true,
    });
    cy.get('.MuiTooltip-tooltip').should('contain', 'fmriprep 0.2.3');
  });
  it('Fires onCheckboxChange event handler with the appropriate payload when the checkbox is clicked', () => {
    const onCheckboxChangeSpy = cy.spy().as('onCheckboxChangeSpy');
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUUID={props.datasetUUID}
        datasetName={props.datasetName}
        datasetPortalURI={props.datasetPortalURI}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        imageModals={props.imageModals}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        pipelines={props.pipelines}
        checked={false}
        onCheckboxChange={onCheckboxChangeSpy}
      />
    );
    cy.get('[data-cy="card-some uuid-checkbox"] input').check();
    cy.get('@onCheckboxChangeSpy').should('have.been.calledWith', props.datasetUUID);
  });
  it('Displays a disabled button with "No pipelines" text when no pipelines are available', () => {
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUUID={props.datasetUUID}
        datasetName={props.datasetName}
        datasetPortalURI={props.datasetPortalURI}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        imageModals={props.imageModals}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        pipelines={{}}
        checked={false}
        onCheckboxChange={props.onCheckboxChange}
      />
    );
    cy.get('[data-cy="card-some uuid-available-pipelines-button"]')
      .should('be.disabled')
      .should('contain', 'No pipelines');
  });
  it('should hide modalities missing abbreviation or data type', () => {
    const propsWithIncompleteModality = {
      ...props,
      imageModals: [...props.imageModals, 'http://purl.org/nidash/nidm#IncompleteModality'],
      imagingModalitiesMetadata: {
        ...props.imagingModalitiesMetadata,
        'http://purl.org/nidash/nidm#IncompleteModality': {
          TermURL: 'nidm:IncompleteModality',
          Label: 'Incomplete Modality',
          Abbreviation: null,
          DataType: 'anat',
        },
      },
    };

    cy.mount(
      <ResultCard
        nodeName={propsWithIncompleteModality.nodeName}
        datasetUUID={propsWithIncompleteModality.datasetUUID}
        datasetName={propsWithIncompleteModality.datasetName}
        datasetPortalURI={propsWithIncompleteModality.datasetPortalURI}
        datasetTotalSubjects={propsWithIncompleteModality.datasetTotalSubjects}
        numMatchingSubjects={propsWithIncompleteModality.numMatchingSubjects}
        imageModals={propsWithIncompleteModality.imageModals}
        imagingModalitiesMetadata={propsWithIncompleteModality.imagingModalitiesMetadata}
        pipelines={propsWithIncompleteModality.pipelines}
        checked={propsWithIncompleteModality.checked}
        onCheckboxChange={propsWithIncompleteModality.onCheckboxChange}
      />
    );

    cy.get('[data-cy="modality-buttons"] button').should('have.length', 2);
    cy.get('[data-cy="modality-buttons"]').should('contain', 'ASL').and('contain', 'DWI');
    cy.get('[data-cy="modality-buttons"]').should('not.contain', 'Incomplete Modality');
  });
  it('should fall back to default styling when data type has no color mapping', () => {
    const propsWithUnknownType = {
      ...props,
      imageModals: [...props.imageModals, 'http://purl.org/nidash/nidm#UnknownTypeModality'],
      imagingModalitiesMetadata: {
        ...props.imagingModalitiesMetadata,
        'http://purl.org/nidash/nidm#UnknownTypeModality': {
          TermURL: 'nidm:UnknownTypeModality',
          Label: 'Unknown Type Modality',
          Abbreviation: 'UNK',
          DataType: 'unknown_type',
        },
      },
    };

    cy.mount(
      <ResultCard
        nodeName={propsWithUnknownType.nodeName}
        datasetUUID={propsWithUnknownType.datasetUUID}
        datasetName={propsWithUnknownType.datasetName}
        datasetPortalURI={propsWithUnknownType.datasetPortalURI}
        datasetTotalSubjects={propsWithUnknownType.datasetTotalSubjects}
        numMatchingSubjects={propsWithUnknownType.numMatchingSubjects}
        imageModals={propsWithUnknownType.imageModals}
        imagingModalitiesMetadata={propsWithUnknownType.imagingModalitiesMetadata}
        pipelines={propsWithUnknownType.pipelines}
        checked={propsWithUnknownType.checked}
        onCheckboxChange={propsWithUnknownType.onCheckboxChange}
      />
    );

    cy.get('[data-cy="modality-buttons"] button').should('have.length', 3);
    cy.contains('[data-cy="modality-buttons"] button', 'UNK')
      .should('exist')
      .should('have.css', 'background-color', 'rgb(25, 118, 210)');
  });
});
