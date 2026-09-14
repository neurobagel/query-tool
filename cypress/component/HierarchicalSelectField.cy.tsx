import HierarchicalSelectField from '../../src/components/HierarchicalSelectField';
import { HierarchicalOption } from '../../src/utils/types';

describe('HierarchicalSelectField', () => {
  const mockOptions: HierarchicalOption[] = [
    {
      id: 'group1::item1',
      label: 'Group 1 Item 1',
      parentId: 'group1',
      parentLabel: 'Group 1',
      isTopLevel: false,
    },
    {
      id: 'group1::item2',
      label: 'Group 1 Item 2',
      parentId: 'group1',
      parentLabel: 'Group 1',
      isTopLevel: false,
    },
    {
      id: 'group2::item1',
      label: 'Group 2 Item 1',
      parentId: 'group2',
      parentLabel: 'Group 2',
      isTopLevel: false,
    },
  ];

  it('should render the field with label and placeholder', () => {
    cy.mount(
      <HierarchicalSelectField
        label="Hierarchical field"
        placeholder="Select an option"
        dataCy="hierarchical-field"
        options={mockOptions}
        value={[]}
        onFieldChange={() => {}}
      />
    );
    cy.get('[data-cy="hierarchical-field"]').should('be.visible');
    cy.get('[data-cy="hierarchical-field"] label').should('contain', 'Hierarchical field');
  });

  it('should fire onFieldChange when a specific child option is selected', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <HierarchicalSelectField
        label="Hierarchical field"
        placeholder="Select an option"
        dataCy="hierarchical-field"
        options={mockOptions}
        value={[]}
        onFieldChange={onFieldChangeSpy}
      />
    );

    cy.get('[data-cy="hierarchical-field"]').click();
    cy.contains('Group 1').click();
    cy.contains('.MuiAutocomplete-option', 'Group 1 Item 1').click();
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', [mockOptions[0]]);
  });

  it('should fire onFieldChange when a group header is toggled', () => {
    const onFieldChangeSpy = cy.spy().as('onFieldChangeSpy');
    cy.mount(
      <HierarchicalSelectField
        label="Hierarchical field"
        placeholder="Select an option"
        dataCy="hierarchical-field"
        groupCheckboxDataCyPrefix="select-group"
        options={mockOptions}
        value={[]}
        onFieldChange={onFieldChangeSpy}
      />
    );

    cy.get('[data-cy="hierarchical-field"]').click();
    cy.get('[data-cy="select-group-group1-checkbox"]').click({ force: true });
    cy.get('@onFieldChangeSpy').should('have.been.calledWith', [
      {
        id: 'group1',
        label: 'Group 1 any version',
        parentId: 'group1',
        parentLabel: 'Group 1',
        isTopLevel: true,
      },
    ]);
  });

  it('should display selected pill with the option label', () => {
    cy.mount(
      <HierarchicalSelectField
        label="Hierarchical field"
        placeholder="Select an option"
        dataCy="hierarchical-field"
        options={mockOptions}
        value={[
          {
            id: 'group1',
            label: 'Group 1 any version',
            parentId: 'group1',
            parentLabel: 'Group 1',
            isTopLevel: true,
          },
        ]}
        onFieldChange={() => {}}
      />
    );

    cy.get('[data-cy="hierarchical-field"]').should('contain', 'Group 1 any version');
  });
});
