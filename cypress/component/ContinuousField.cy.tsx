import ContinuousField from '../../src/components/ContinuousField';

const defaultProps = {
  helperText: 'This is a helper text',
  label: 'Continuous Field',
  value: '',
  onFieldChange: () => {},
};

describe('ContinuousField', () => {
  it('Displays a MUI Textfield and a label as passed via prop', () => {
    cy.mount(
      <ContinuousField
        label={defaultProps.label}
        value={defaultProps.value}
        onFieldChange={defaultProps.onFieldChange}
      />
    );
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
        label={defaultProps.label}
        onFieldChange={defaultProps.onFieldChange}
        helperText={defaultProps.helperText}
        value={defaultProps.value}
      />
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] p').should(
      'contain',
      'This is a helper text'
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] label').should('have.class', 'Mui-error');
  });
  it('Displays the value passed via prop', () => {
    cy.mount(
      <ContinuousField
        label={defaultProps.label}
        value="42"
        onFieldChange={defaultProps.onFieldChange}
      />
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] input').should('have.value', '42');
  });
  it('Fires onFieldChange event handler with the appropriate payload when a value is entered', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <ContinuousField label={defaultProps.label} value="1" onFieldChange={onFieldChangeSpy} />
    );
    cy.get('[data-cy="Continuous Field-continuous-field"] input').type('0');
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Continuous Field', '10');
  });
});
