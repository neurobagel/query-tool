import MultiSelectField from '../../src/components/MultiSelectField';

describe('MultiSelectField', () => {
  const defaultProps = {
    label: 'Diagnosis',
    options: [
      { label: "Alzheimer's disease", id: 'snomed:26929004' },
      { label: "Parkinson's disease", id: 'snomed:49049000' },
    ],
    value: [],
    onFieldChange: () => {},
  };

  it('should render the field with label and placeholder', () => {
    cy.mount(<MultiSelectField {...defaultProps} />);
    cy.get('[data-cy="Diagnosis-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Diagnosis-categorical-field"] label').should('contain', 'Diagnosis');
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should(
      'have.attr',
      'placeholder',
      'Select an option'
    );
  });

  it('should fire onFieldChange with array when an option is selected', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(<MultiSelectField {...defaultProps} onFieldChange={onFieldChangeSpy} />);

    cy.get('[data-cy="Diagnosis-categorical-field"]').click();
    cy.contains('.MuiAutocomplete-option', "Alzheimer's disease").click();
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Diagnosis', [
      { label: "Alzheimer's disease", id: 'snomed:26929004' },
    ]);
  });

  it('should display selected items as chips', () => {
    cy.mount(
      <MultiSelectField
        {...defaultProps}
        value={[{ label: "Parkinson's disease", id: 'snomed:49049000' }]}
      />
    );

    cy.get('[data-cy="Diagnosis-categorical-field"]').should('contain', "Parkinson's disease");
  });

  it('should be disabled when disabled prop is true', () => {
    cy.mount(<MultiSelectField {...defaultProps} disabled={true} />);
    cy.get('[data-cy="Diagnosis-categorical-field"] input').should('be.disabled');
  });
});
