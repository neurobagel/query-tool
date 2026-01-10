import ResultCard from '../../src/components/ResultCard';

const props = {
  nodeName: 'some node name',
  datasetUuid: 'some uuid',
  datasetName: 'some dataset name',
  repositoryUrl: 'some portal uri',
  datasetTotalSubjects: 10,
  numMatchingSubjects: 5,
  recordsProtected: false,
  imageModals: [
    'http://purl.org/nidash/nidm#ArterialSpinLabeling',
    'http://purl.org/nidash/nidm#DiffusionWeighted',
  ],
  availablePipelines: {
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
  authors: ['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Johnson', 'Charlie Brown'],
  homepage: 'https://example.com',
  referencesAndLinks: ['https://somesite.com', 'https://anothersite.com'],
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  accessInstructions: 'some instructions',
  accessType: 'public' as const,
  accessEmail: 'someemail@domain.com',
  accessLink: 'https://example.com',
  checked: true,
  onCheckboxChange: () => {},
};

describe('ResultCard', () => {
  it('Displays a result card with all the expected properties', () => {
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUuid={props.datasetUuid}
        datasetName={props.datasetName}
        repositoryUrl={props.repositoryUrl}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        recordsProtected={props.recordsProtected}
        imageModals={props.imageModals}
        availablePipelines={props.availablePipelines}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        authors={props.authors}
        homepage={props.homepage}
        referencesAndLinks={props.referencesAndLinks}
        keywords={props.keywords}
        accessInstructions={props.accessInstructions}
        accessType={props.accessType}
        accessEmail={props.accessEmail}
        accessLink={props.accessLink}
        checked={props.checked}
        onCheckboxChange={props.onCheckboxChange}
      />
    );
    cy.get('[data-cy="card-some uuid"]').should('be.visible');
    cy.get('[data-cy="card-some uuid"]').should('contain', 'some dataset name');
    cy.get('[data-cy="card-some uuid"]').should('contain', 'some node name node');
    cy.get('[data-cy="card-some uuid"]').should('contain', 'John Doe, Jane Doe, Bob Smith et al.');
    cy.get('[data-cy="card-some uuid"]').should('contain', 'Matching subjects:');
    cy.get('[data-cy="card-some uuid"]').should('contain', '5 / 10');
    cy.get('[data-cy="card-some uuid-checkbox"] input').should('be.checked');
    cy.get('[data-cy="card-some uuid-ASL-imaging-modality-button"]')
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(0, 150, 136)');
    cy.get('[data-cy="card-some uuid-DWI-imaging-modality-button"]')
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(253, 164, 164)');
    cy.get('[data-cy="card-some uuid-fmriprep-available-pipelines-button"]').should('be.visible');
    cy.get('[data-cy="card-some uuid-fmriprep-available-pipelines-button"]').trigger('mouseover', {
      force: true,
    });
    cy.get('.MuiTooltip-tooltip').should('contain', '0.2.3').and('contain', '23.1.3');
    cy.get('[data-cy="card-some uuid-access-type-icon-group"]').should('be.visible');
    cy.get('[data-cy="card-some uuid-public-access-type-icon"]').should(
      'have.class',
      'MuiSvgIcon-colorSuccess'
    );
    cy.get('[data-cy="card-some uuid-homepage-icon"]').should('be.visible').and('not.be.disabled');
    cy.get('[data-cy="card-some uuid-download-icon"]').should('be.visible').and('not.be.disabled');
    cy.get('[data-cy="card-some uuid-expand-button"]').should('be.visible');
    cy.get('[data-cy="card-some uuid-expand-button"]').click();
    cy.get('[data-cy="card-some uuid-keywords"]')
      .should('be.visible')
      .and('contain', 'keyword1')
      .and('contain', 'keyword2')
      .and('contain', 'keyword3');
    cy.get('[data-cy="card-some uuid-access"]')
      .should('be.visible')
      .and('contain', 'some instructions');
    cy.get('[data-cy="card-some uuid-access-data-button"]')
      .should('be.visible')
      .and('not.be.disabled');
    cy.get('[data-cy="card-some uuid-access-contact-button"]')
      .should('be.visible')
      .and('not.be.disabled');
    cy.get('[data-cy="card-some uuid-repository-button"]')
      .should('be.visible')
      .and('not.be.disabled');
    cy.get('[data-cy="card-some uuid-references"]')
      .should('be.visible')
      .and('contain', 'https://somesite.com')
      .and('contain', 'https://anothersite.com');
  });

  it('Displays default content and disabled buttons when optional fields are missing', () => {
    const propsMissingFields = {
      ...props,
      authors: [],
      homepage: null,
      referencesAndLinks: [],
      keywords: [],
      repositoryUrl: null,
      accessInstructions: null,
      accessType: null,
      accessEmail: null,
      accessLink: null,
      imageModals: [],
      availablePipelines: {},
    };

    cy.mount(
      <ResultCard
        nodeName={propsMissingFields.nodeName}
        datasetUuid={propsMissingFields.datasetUuid}
        datasetName={propsMissingFields.datasetName}
        repositoryUrl={propsMissingFields.repositoryUrl}
        datasetTotalSubjects={propsMissingFields.datasetTotalSubjects}
        numMatchingSubjects={propsMissingFields.numMatchingSubjects}
        recordsProtected={propsMissingFields.recordsProtected}
        imageModals={propsMissingFields.imageModals}
        availablePipelines={propsMissingFields.availablePipelines}
        imagingModalitiesMetadata={propsMissingFields.imagingModalitiesMetadata}
        authors={propsMissingFields.authors}
        homepage={propsMissingFields.homepage}
        referencesAndLinks={propsMissingFields.referencesAndLinks}
        keywords={propsMissingFields.keywords}
        accessInstructions={propsMissingFields.accessInstructions}
        accessType={propsMissingFields.accessType}
        accessEmail={propsMissingFields.accessEmail}
        accessLink={propsMissingFields.accessLink}
        checked={propsMissingFields.checked}
        onCheckboxChange={propsMissingFields.onCheckboxChange}
      />
    );

    cy.get('[data-cy="card-some uuid"]').should('contain', 'No authors listed');
    cy.get('[data-cy="card-some uuid-homepage-icon"]').should('be.disabled');
    cy.get('[data-cy="card-some uuid-download-icon"]').should(
      'have.class',
      'MuiSvgIcon-colorDisabled'
    );

    cy.get('[data-cy="card-some uuid-access-type-icon-group"] .MuiSvgIcon-colorDisabled').should(
      'have.length',
      3
    );
    cy.contains('No imaging modalities available').should('be.disabled');
    cy.get('[data-cy="card-some uuid-available-pipelines-button"]')
      .should('be.disabled')
      .should('contain', 'No derivative data available');

    cy.get('[data-cy="card-some uuid-expand-button"]').click();

    cy.get('[data-cy="card-some uuid-keywords"]').should('contain', 'No keywords available');

    cy.get('[data-cy="card-some uuid"] .MuiCollapse-wrapperInner').should(
      'contain',
      'No authors listed'
    );

    cy.get('[data-cy="card-some uuid-access"]').should('contain', 'No access instructions');

    cy.get('[data-cy="card-some uuid-access-data-button"]').should('be.disabled');
    cy.get('[data-cy="card-some uuid-access-contact-button"]').should('be.disabled');
    cy.get('[data-cy="card-some uuid-repository-button"]').should('be.disabled');

    cy.get('[data-cy="card-some uuid-references"]').should('contain', 'No references available');
  });
  it('Fires onCheckboxChange event handler with the appropriate payload when the checkbox is clicked', () => {
    const onCheckboxChangeSpy = cy.spy().as('onCheckboxChangeSpy');
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUuid={props.datasetUuid}
        datasetName={props.datasetName}
        repositoryUrl={props.repositoryUrl}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        recordsProtected={props.recordsProtected}
        imageModals={props.imageModals}
        availablePipelines={props.availablePipelines}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        authors={props.authors}
        homepage={props.homepage}
        referencesAndLinks={props.referencesAndLinks}
        keywords={props.keywords}
        accessInstructions={props.accessInstructions}
        accessType={props.accessType}
        accessEmail={props.accessEmail}
        accessLink={props.accessLink}
        checked={false}
        onCheckboxChange={onCheckboxChangeSpy}
      />
    );
    cy.get('[data-cy="card-some uuid-checkbox"] input').check();
    cy.get('@onCheckboxChangeSpy').should('have.been.calledWith', props.datasetUuid);
  });
  it('Displays a disabled button with "No pipelines" text when no pipelines are available', () => {
    cy.mount(
      <ResultCard
        nodeName={props.nodeName}
        datasetUuid={props.datasetUuid}
        datasetName={props.datasetName}
        repositoryUrl={props.repositoryUrl}
        datasetTotalSubjects={props.datasetTotalSubjects}
        numMatchingSubjects={props.numMatchingSubjects}
        recordsProtected={props.recordsProtected}
        imageModals={props.imageModals}
        availablePipelines={{}}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        authors={props.authors}
        homepage={props.homepage}
        referencesAndLinks={props.referencesAndLinks}
        keywords={props.keywords}
        accessInstructions={props.accessInstructions}
        accessType={props.accessType}
        accessEmail={props.accessEmail}
        accessLink={props.accessLink}
        checked={false}
        onCheckboxChange={props.onCheckboxChange}
      />
    );
    cy.get('[data-cy="card-some uuid-available-pipelines-button"]')
      .should('be.disabled')
      .should('contain', 'No derivative data available');
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
        datasetUuid={propsWithIncompleteModality.datasetUuid}
        datasetName={propsWithIncompleteModality.datasetName}
        repositoryUrl={propsWithIncompleteModality.repositoryUrl}
        datasetTotalSubjects={propsWithIncompleteModality.datasetTotalSubjects}
        numMatchingSubjects={propsWithIncompleteModality.numMatchingSubjects}
        recordsProtected={propsWithIncompleteModality.recordsProtected}
        imageModals={propsWithIncompleteModality.imageModals}
        availablePipelines={propsWithIncompleteModality.availablePipelines}
        imagingModalitiesMetadata={propsWithIncompleteModality.imagingModalitiesMetadata}
        authors={propsWithIncompleteModality.authors}
        homepage={propsWithIncompleteModality.homepage}
        referencesAndLinks={propsWithIncompleteModality.referencesAndLinks}
        keywords={propsWithIncompleteModality.keywords}
        accessInstructions={propsWithIncompleteModality.accessInstructions}
        accessType={propsWithIncompleteModality.accessType}
        accessEmail={propsWithIncompleteModality.accessEmail}
        accessLink={propsWithIncompleteModality.accessLink}
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
        datasetUuid={propsWithUnknownType.datasetUuid}
        datasetName={propsWithUnknownType.datasetName}
        repositoryUrl={propsWithUnknownType.repositoryUrl}
        datasetTotalSubjects={propsWithUnknownType.datasetTotalSubjects}
        numMatchingSubjects={propsWithUnknownType.numMatchingSubjects}
        recordsProtected={propsWithUnknownType.recordsProtected}
        imageModals={propsWithUnknownType.imageModals}
        availablePipelines={propsWithUnknownType.availablePipelines}
        imagingModalitiesMetadata={propsWithUnknownType.imagingModalitiesMetadata}
        authors={propsWithUnknownType.authors}
        homepage={propsWithUnknownType.homepage}
        referencesAndLinks={propsWithUnknownType.referencesAndLinks}
        keywords={propsWithUnknownType.keywords}
        accessInstructions={propsWithUnknownType.accessInstructions}
        accessType={propsWithUnknownType.accessType}
        accessEmail={propsWithUnknownType.accessEmail}
        accessLink={propsWithUnknownType.accessLink}
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
