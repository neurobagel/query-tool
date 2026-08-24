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
      cy.get('[data-cy="Categorical Field-categorical-field"] input').type(
        `${option.label}{downarrow}{enter}`
      );
      cy.get('[data-cy="Categorical Field-categorical-field"] input').should(
        'have.value',
        option.label
      );
      cy.get('[data-cy="Categorical Field-categorical-field"] input').clear();
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
    cy.get('[data-cy="Categorical Field-categorical-field"] input').type(
      'Option 1{downarrow}{enter}'
    );
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Categorical Field', {
      id: '1',
      label: 'Option 1',
    });
  });
  it('Renders option checkboxes and stays open when multiple selection is enabled', () => {
    cy.mount(
      <CategoricalField
        label={props.label}
        options={props.options}
        onFieldChange={props.onFieldChange}
        inputValue={[]}
        multiple={true}
      />
    );
    cy.get('[data-cy="Categorical Field-categorical-field"]').click();
    cy.get('.MuiAutocomplete-popper').should('be.visible');
    cy.get('.MuiAutocomplete-option').should('have.length', 3);
    cy.get('.MuiAutocomplete-option .MuiCheckbox-root').should('have.length', 3);

    cy.contains('.MuiAutocomplete-option', 'Option 1').click();
    cy.get('.MuiAutocomplete-popper').should('be.visible');
  });
  it('Fires onFieldChange event handler with an array payload when multiple selection is enabled', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <CategoricalField
        label={props.label}
        options={props.options}
        onFieldChange={onFieldChangeSpy}
        inputValue={[]}
        multiple={true}
      />
    );
    cy.get('[data-cy="Categorical Field-categorical-field"]').click();
    cy.contains('.MuiAutocomplete-option', 'Option 1').click();
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Categorical Field', [
      { id: '1', label: 'Option 1' },
    ]);
  });
  it('Supports custom renderGroup prop for grouped options', () => {
    cy.mount(
      <CategoricalField
        label={props.label}
        options={props.options}
        onFieldChange={props.onFieldChange}
        inputValue={props.inputValue}
        renderGroup={(params) => (
          <li key={params.key}>
            <div data-cy="custom-group-header">{params.group}</div>
            <ul>{params.children}</ul>
          </li>
        )}
        groupBy={() => 'Group 1'}
      />
    );
    cy.get('[data-cy="Categorical Field-categorical-field"]').click();
    cy.get('[data-cy="custom-group-header"]').should('contain', 'Group 1');
  });
});
