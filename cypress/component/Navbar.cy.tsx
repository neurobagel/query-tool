import Navbar from "../../src/components/Navbar";

describe("Navbar", () => {
    it("Displays a MUI Toolbar with logo, title, subtitle, documentation link, and GitHub link", () => {
        cy.mount(<Navbar />);
        cy.get("[data-cy='navbar']").should("be.visible");
        cy.get("[data-cy='navbar'] img").should("have.attr", "src", "https://raw.githubusercontent.com/neurobagel/documentation/main/docs/imgs/logo/neurobagel_logo.png");
        cy.get("[data-cy='navbar'] h5").should("contain", "Neurobagel Query");
        cy.get("[data-cy='navbar'] p").should("contain", "Define and find cohorts at the subject level");
        cy.get("[data-cy='navbar'] a").should("contain", "Documentation").should("have.attr", "href", "https://neurobagel.org/query_tool/");
        cy.get("[data-cy='navbar'] a").eq(1).find('svg').should("be.visible");
        cy.get("[data-cy='navbar'] a").eq(1).should("have.attr", "href", "https://github.com/neurobagel/react-query-tool/");
    })
})