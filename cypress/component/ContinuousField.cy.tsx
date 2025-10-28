import { useState } from 'react';
import ContinuousField from '../../src/components/ContinuousField';

const defaultProps = {
  helperText: 'This is a helper text',
  label: 'Continuous Field',
  onFieldChange: () => {},
};

describe('ContinuousField', () => {
  it('Displays a MUI Textfield and a label as passed via prop', () => {
    cy.mount(
      <ContinuousField
        label={defaultProps.label}
        value=""
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
        value=""
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
    // We need to provide local state so the controlled form reflects typing; without feeding the updated
    // value back in, the field would instantly revert to null and the change handler would only
    // ever report intermediate characters e.g, instead of one payload being 10 it would read two payloads of 1 and 0.
    function ControlledField(): JSX.Element {
      const [value, setValue] = useState<string>('');
      return (
        <ContinuousField
          label={defaultProps.label}
          value={value}
          onFieldChange={(label, nextValue) => {
            setValue(nextValue);
            onFieldChangeSpy(label, nextValue);
          }}
        />
      );
    }
    cy.mount(<ControlledField />);
    cy.get('[data-cy="Continuous Field-continuous-field"]').type('10');
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', 'Continuous Field', '10');
  });
});
