import ContinuousField from '../../src/components/ContinuousField';

const props = {
  helperText: 'This is a helper text',
  label: 'Continuous Field',
  onFieldChange: () => {},
};

describe('ContinuousField', () => {
  it('Displays a MUI Textfield and a label as passed via prop', () => {
    cy.mount(<ContinuousField label={props.label} onFieldChange={props.onFieldChange} />);
    cy.get('[data-cy="Continuous Field-continuous-field"]').should('be.visible');
    cy.get('[data-cy="Continuous Field-continuous-field"] label').should(
      'contain',
      'Continuous Field'
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] label').should(
      'not.have.class',
      'Mui-error'
    );
  });
  it('Displays a MUI Textfield in error state when the helper text is not empty', () => {
    cy.mount(
      <ContinuousField
        label={props.label}
        onFieldChange={props.onFieldChange}
        helperText={props.helperText}
      />
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] p').should(
      'contain',
      'This is a helper text'
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] label').should('have.class', 'Mui-error');
  });
  it('Fires onFieldChange event handler with the appropriate payload when a value is entered', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(<ContinuousField label={props.label} onFieldChange={onFieldChangeSpy} />);
    cy.get('[data-cy="Continuous Field-continuous-field"]').type('10');
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Continuous Field', 10);
  });
});
