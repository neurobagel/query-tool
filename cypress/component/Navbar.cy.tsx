import { useState } from 'react';
import Navbar from '../../src/components/Navbar';
import { Notification } from '../../src/utils/types';

describe('Navbar', () => {
  const mockNotifications: Notification[] = [
    { id: '1', type: 'info', message: 'This is an info notification.' },
    { id: '2', type: 'warning', message: 'This is a warning notification.' },
  ];

  function NavbarWrapper() {
    const [notifications, setNotifications] = useState(mockNotifications);

    return (
      <Navbar
        isLoggedIn
        onLogin={() => {}}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    );
  }

  it('Displays a MUI Toolbar with logo, title, subtitle, documentation link, and GitHub link', () => {
    cy.mount(<NavbarWrapper />);
    cy.get("[data-cy='navbar']").should('be.visible');
    cy.get("[data-cy='navbar'] img").should('exist');
    cy.get("[data-cy='navbar'] h5").should('contain', 'Neurobagel Query');
    cy.get("[data-cy='navbar'] p").should(
      'contain',
      'Define and find cohorts at the subject level'
    );
    // Check for the documentation and GitHub icon and links
    cy.get("[data-cy='navbar'] a").eq(0).find('svg').should('be.visible');
    cy.get("[data-cy='navbar'] a")
      .eq(0)
      .should('have.attr', 'href', 'https://neurobagel.org/user_guide/query_tool/');
    cy.get("[data-cy='navbar'] a").eq(1).find('svg').should('be.visible');
    cy.get("[data-cy='navbar'] a")
      .eq(1)
      .should('have.attr', 'href', 'https://github.com/neurobagel/query-tool/');
  });
  // Verify that the visibility and texts match for each notification.
  it('Verifies the visibility and functionality of the Navbar notifications feature', () => {
    cy.mount(<NavbarWrapper />);
    cy.get("[data-cy='notification-button']").should('exist');
    cy.get("[data-cy='navbar']")
      .find('.MuiBadge-badge')
      .should('contain', mockNotifications.length);
    cy.get("[data-cy='notification-button']").click();
    cy.get('.MuiPopover-paper').should('be.visible');

    cy.get('.MuiList-root').within(() => {
      cy.get('.MuiListItem-root').should('have.length', mockNotifications.length);
      mockNotifications.forEach((notification, index) => {
        cy.get('.MuiListItem-root')
          .eq(index)
          .within(() => {
            cy.get('.MuiListItemText-primary').should('contain', notification.type.toUpperCase());
            cy.get('.MuiListItemText-secondary').should('contain', notification.message);
          });
      });
    });

    cy.get('.MuiPopover-paper').trigger('keydown', { key: 'Escape' });
    cy.get('.MuiPopover-paper').should('not.exist');
  });
  // Verify delete functionality
  it('Deletes a notification', () => {
    cy.mount(<NavbarWrapper />);
    cy.get("[data-cy='notification-button']").click();
    cy.get('.MuiPopover-paper').should('be.visible');
    cy.get("[data-cy='delete-notification']").first().click();
    cy.get("[data-cy='notification-item']").should('have.length', mockNotifications.length - 1);
  });
  // Verify clear all functionality
  it('Clears all notifications', () => {
    cy.mount(<NavbarWrapper />);
    cy.get("[data-cy='notification-button']").click();
    cy.get('.MuiPopover-paper').should('be.visible');
    cy.get("[data-cy='clear-all-notifications']").click();
    cy.get("[data-cy='notification-item']").should('have.length', 0);
    cy.contains('No notifications').should('be.visible');
    cy.get('.MuiPopover-paper').trigger('keydown', { key: 'Escape' });
    cy.get('.MuiPopover-paper').should('not.exist');
  });
});
