import SmallScreenSizeDialog from '../../src/components/SmallScreenSizeDialog';

const props = {
  onClose: () => {},
};

describe('SmallScreenSizeDialog', () => {
  it('Displays a MUI dialog with the title and "sing in with google" button', () => {
    cy.mount(<SmallScreenSizeDialog open onClose={props.onClose} />);
    cy.get('[data-cy="small-screen-size-dialog"]').should('be.visible');
    cy.get('[data-cy="small-screen-size-dialog"]').should('contain', 'Unsupported Screen Size');
    cy.get('[data-cy="small-screen-size-dialog"]').should(
      'contain',
      'not optimized for use on smaller screens'
    );
    cy.get('[data-cy="close-small-screen-size-dialog-button"]').should('be.visible');
  });
});
