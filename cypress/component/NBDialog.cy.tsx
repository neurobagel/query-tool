import NBDialog from "../../src/components/NBDialog";

const props = {
    open: true,
    onClose: () => {},
};

describe("NBDialog", () => {
    it("Displays a MUI Diaglog with the title and content", () => {
        cy.mount(<NBDialog open={props.open} onClose={props.onClose} />);
        cy.get('[data-cy="nb-dialog"]').should("be.visible");
        cy.get('[data-cy="nb-dialog"] h2').should("contain", "Example usage");
        cy.get('[data-cy="nb-dialog"] p').should("contain", "The command for automatically getting the data currently only applies to datasets available through datalad.");
    })
    it("Doesn't display the dialog when open prop is set to false", () => {
        cy.mount(<NBDialog open={false} onClose={props.onClose} />);
        cy.get('[data-cy="nb-dialog"]').should("not.exist");
    })
    it("Fires onClose event handler when the close button is clicked", () => {
        const onClose = cy.spy().as("onClose");
        cy.mount(<NBDialog open={props.open} onClose={onClose} />);
        cy.get('[data-cy="nb-dialog"] button').click();
        cy.get('@onClose').should("have.been.called");
    })
})