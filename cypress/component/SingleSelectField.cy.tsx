import SingleSelectField from '../../src/components/SingleSelectField';

describe('SingleSelectField', () => {
  const defaultProps = {
    label: 'Sex',
    options: [
      { label: 'female', id: 'snomed:248152002' },
      { label: 'male', id: 'snomed:248153007' },
      { label: 'other', id: 'snomed:32570681000036106' },
    ],
    value: null,
    onFieldChange: () => {},
  };

  it('should render the field with label and placeholder', () => {
    cy.mount(<SingleSelectField {...defaultProps} />);
    cy.get('[data-cy="Sex-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Sex-categorical-field"] label').should('contain', 'Sex');
    cy.get('[data-cy="Sex-categorical-field"] input').should(
      'have.attr',
      'placeholder',
      'Select an option'
    );
  });

  it('should fire onFieldChange when an option is selected', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(<SingleSelectField {...defaultProps} onFieldChange={onFieldChangeSpy} />);

    cy.get('[data-cy="Sex-categorical-field"]').click();
    cy.contains('.MuiAutocomplete-option', 'female').click();
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Sex', {
      label: 'female',
      id: 'snomed:248152002',
    });
  });

  it('should be disabled when disabled prop is true', () => {
    cy.mount(<SingleSelectField {...defaultProps} disabled={true} />);
    cy.get('[data-cy="Sex-categorical-field"] input').should('be.disabled');
  });
});
