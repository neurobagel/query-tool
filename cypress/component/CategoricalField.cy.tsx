import CategoricalField from '../../src/components/CategoricalField';

const props = {
  label: 'Categorical Field',
  options: [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' },
  ],
  onFieldChange: () => {},
  multiple: false,
  inputValue: null,
};

describe('CategoricalField', () => {
  it('Displays a MUI Autocomplete with the label and options passed as props', () => {
    cy.mount(
      <CategoricalField
        label={props.label}
        options={props.options}
        onFieldChange={props.onFieldChange}
        inputValue={props.inputValue}
      />
    );
    cy.get('[data-cy="Categorical Field-categorical-field"]').should('be.visible');
    cy.get('[data-cy="Categorical Field-categorical-field"] label').should(
      'contain',
      'Categorical Field'
    );
    props.options.forEach((option) => {
      cy.get('[data-cy="Categorical Field-categorical-field"]').type(
        `${option.label}{downarrow}{enter}`
      );
      cy.get('[data-cy="Categorical Field-categorical-field"] input').should(
        'have.value',
        option.label
      );
      cy.get('[data-cy="Categorical Field-categorical-field"]').clear();
    });
  });
  it('Displays the input value passed as props', () => {
    cy.mount(
      <CategoricalField
        label={props.label}
        options={props.options}
        onFieldChange={props.onFieldChange}
        inputValue={props.options[0]}
      />
    );
    cy.get('[data-cy="Categorical Field-categorical-field"] input').should(
      'have.value',
      'Option 1'
    );
  });
  it('Fires onFieldChange event handler with the appropriate payload when a value is selected', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <CategoricalField
        label={props.label}
        options={props.options}
        onFieldChange={onFieldChangeSpy}
        inputValue={props.inputValue}
      />
    );
    cy.get('[data-cy="Categorical Field-categorical-field"]').type('Option 1{downarrow}{enter}');
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Categorical Field', {
      id: '1',
      label: 'Option 1',
    });
  });
});
