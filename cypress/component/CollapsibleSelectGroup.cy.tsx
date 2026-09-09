import CollapsibleSelectGroup from '../../src/components/CollapsibleSelectGroup';

describe('CollapsibleSelectGroup', () => {
  it('should render the group label and unchecked checkbox when group is not selected', () => {
    cy.mount(
      <ul>
        <CollapsibleSelectGroup
          groupKey="group-1"
          groupId="group-1"
          groupLabel="Category 1"
          isGroupChecked={false}
          onToggleGroup={() => {}}
        >
          <li key="item1">Child 1</li>
        </CollapsibleSelectGroup>
      </ul>
    );

    cy.contains('Category 1').should('be.visible');
    cy.get('[data-cy="select-group-group-1-checkbox"] input').should('not.be.checked');
  });

  it('should render checkbox as checked when isGroupChecked is true', () => {
    cy.mount(
      <ul>
        <CollapsibleSelectGroup
          groupKey="group-1"
          groupId="group-1"
          groupLabel="Category 1"
          isGroupChecked={true}
          onToggleGroup={() => {}}
        >
          <li key="item1">Child 1</li>
        </CollapsibleSelectGroup>
      </ul>
    );

    cy.get('[data-cy="select-group-group-1-checkbox"] input').should('be.checked');
  });

  it('should fire onToggleGroup event handler when clicking the group header checkbox', () => {
    const onToggleGroupSpy = cy.spy().as('onToggleGroupSpy');
    cy.mount(
      <ul>
        <CollapsibleSelectGroup
          groupKey="group-1"
          groupId="group-1"
          groupLabel="Category 1"
          isGroupChecked={false}
          onToggleGroup={onToggleGroupSpy}
        >
          <li key="item1">Child 1</li>
        </CollapsibleSelectGroup>
      </ul>
    );

    cy.get('[data-cy="select-group-group-1-checkbox"]').click({ force: true });
    cy.get('@onToggleGroupSpy').should('have.been.calledWith', 'group-1', 'Category 1');
  });

  it('should render checkbox as indeterminate when isGroupIndeterminate is true', () => {
    cy.mount(
      <ul>
        <CollapsibleSelectGroup
          groupKey="group-1"
          groupId="group-1"
          groupLabel="Category 1"
          isGroupChecked={false}
          isGroupIndeterminate={true}
          onToggleGroup={() => {}}
        >
          <li key="item1">Child 1</li>
        </CollapsibleSelectGroup>
      </ul>
    );

    cy.get(
      '[data-cy="select-group-group-1-checkbox"] [data-testid="IndeterminateCheckBoxIcon"]'
    ).should('be.visible');
    cy.get('[data-cy="select-group-group-1-checkbox"] input').should('not.be.checked');
  });
});
