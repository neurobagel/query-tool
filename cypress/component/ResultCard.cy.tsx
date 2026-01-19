import ResultCard from '../../src/components/ResultCard/ResultCard';

const props = {
  node_name: 'some node name',
  dataset_uuid: 'some uuid',
  dataset_name: 'some dataset name',
  repository_url: 'some repository uri',
  dataset_total_subjects: 10,
  num_matching_subjects: 5,
  records_protected: false,
  image_modals: [
    'http://purl.org/nidash/nidm#ArterialSpinLabeling',
    'http://purl.org/nidash/nidm#DiffusionWeighted',
  ],
  available_pipelines: {
    'https://github.com/nipoppy/pipeline-catalog/tree/main/processing/fmriprep': [
      '0.2.3',
      '23.1.3',
    ],
  },
  authors: ['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Johnson', 'Charlie Brown'],
  homepage: 'https://example.com',
  references_and_links: ['https://somesite.com', 'https://anothersite.com'],
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  access_instructions: 'some instructions',
  access_type: 'public' as const,
  access_email: 'someemail@domain.com',
  access_link: 'https://example.com',
  checked: true,
  onCheckboxChange: () => { },
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
};

describe('ResultCard', () => {
  it('Displays a result card with all the expected properties', () => {
    cy.mount(
      <ResultCard
        dataset={props}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
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
      references_and_links: [],
      keywords: [],
      repository_url: null,
      access_instructions: null,
      access_type: null,
      access_email: null,
      access_link: null,
      image_modals: [],
      available_pipelines: {},
    };

    cy.mount(
      <ResultCard
        dataset={propsMissingFields}
        imagingModalitiesMetadata={propsMissingFields.imagingModalitiesMetadata}
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
        dataset={props}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
        checked={false}
        onCheckboxChange={onCheckboxChangeSpy}
      />
    );
    cy.get('[data-cy="card-some uuid-checkbox"] input').check();
    cy.get('@onCheckboxChangeSpy').should('have.been.calledWith', props.dataset_uuid);
  });
  it('Displays a disabled button with "No pipelines" text when no pipelines are available', () => {
    cy.mount(
      <ResultCard
        dataset={{ ...props, available_pipelines: {} }}
        imagingModalitiesMetadata={props.imagingModalitiesMetadata}
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
      image_modals: [...props.image_modals, 'http://purl.org/nidash/nidm#IncompleteModality'],
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
        dataset={propsWithIncompleteModality}
        imagingModalitiesMetadata={propsWithIncompleteModality.imagingModalitiesMetadata}
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
      image_modals: [...props.image_modals, 'http://purl.org/nidash/nidm#UnknownTypeModality'],
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
        dataset={propsWithUnknownType}
        imagingModalitiesMetadata={propsWithUnknownType.imagingModalitiesMetadata}
        checked={propsWithUnknownType.checked}
        onCheckboxChange={propsWithUnknownType.onCheckboxChange}
      />
    );

    cy.get('[data-cy="modality-buttons"] button').should('have.length', 3);
    cy.contains('[data-cy="modality-buttons"] button', 'UNK')
      .should('exist')
      .should('have.css', 'background-color', 'rgb(25, 118, 210)');
  });
  it('should display modalities and pipelines without overlap and wrap correctly on smaller screens', () => {
    // Force a small viewport to ensure wrapping occurs
    cy.viewport(768, 900);

    const crowdedProps = {
      ...props,
      image_modals: [
        'http://purl.org/nidash/nidm#ArterialSpinLabeling',
        'http://purl.org/nidash/nidm#DiffusionWeighted',
        'http://purl.org/nidash/nidm#FlowWeighted',
        'http://purl.org/nidash/nidm#T1Weighted',
      ],
      available_pipelines: {
        fmriprep: ['1.0'],
        freesurfer: ['6.0'],
      },
      imagingModalitiesMetadata: {
        ...props.imagingModalitiesMetadata,
        'http://purl.org/nidash/nidm#FlowWeighted': {
          TermURL: 'nidm:FlowWeighted',
          Label: 'Blood Oxygen Level Dependent',
          Abbreviation: 'BOLD',
          DataType: 'func',
        },
        'http://purl.org/nidash/nidm#T1Weighted': {
          TermURL: 'nidm:T1Weighted',
          Label: 'T1 Weighted',
          Abbreviation: 'T1W',
          DataType: 'anat',
        },
      },
    };

    cy.mount(
      <ResultCard
        dataset={crowdedProps}
        imagingModalitiesMetadata={crowdedProps.imagingModalitiesMetadata}
        checked={props.checked}
        onCheckboxChange={props.onCheckboxChange}
      />
    );

    // Get all buttons in the container (modalities and pipelines)
    // We target the container that holds both to ensure we check them together
    cy.get('[data-cy="modality-buttons"]').parent().as('container');

    cy.get('@container').find('button').should('have.length.at.least', 5);

    cy.get('@container')
      .find('button')
      .then(($buttons) => {
        const firstBtn = $buttons.first()[0].getBoundingClientRect();
        const lastBtn = $buttons.last()[0].getBoundingClientRect();

        // Native/Best-Practice Check for Wrapping:
        // If flex-wrap is working correctly on a narrow screen, the last item
        // should be visually positioned BELOW the first item (higher 'y' or 'top' value).
        // If they were overlapping or overflowing horizontally, 'top' would be the same.
        expect(lastBtn.top).to.be.greaterThan(
          firstBtn.top,
          'Items should wrap to a new line on smaller screens'
        );
      });
  });
});
