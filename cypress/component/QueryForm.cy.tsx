import QueryForm from "../../src/components/QueryForm";

const props = {
availableNodes: [
 {
  NodeName: "Some Node Name",
  ApiURL: "https://someurl/",
 },
 {
  NodeName: "Another Node Name",
  ApiURL: "http://anotherurl/",
 },
 ],
  diagnosisOptions: [
  {
   Label: "Some Diagnosis",
   TermURL: "https://someurl/",
  },
  {
   Label: "Another Diagnosis",
   TermURL: "http://anotherurl/",
  },
  ],
  assessmentOptions: [
    {
     Label: "Some Assessment",
     TermURL: "https://someurl/",
    },
    {
     Label: "Another Assessment",
     TermURL: "http://anotherurl/",
    }
  ],
  selectedNode: [],
  minAge: null,
  maxAge: null,
  sex: null,
  diagnosis: null,
  isControl: false,
  minNumSessions: null,
  setIsControl: () => {},
  assessmentTool: null,
  imagingModality: null,
  updateCategoricalQueryParams: () => {},
  updateContinuousQueryParams: () => {},
  loading: false,
  onSubmitQuery: () => {},
}

describe("QueryForm", () => {
    it("Displays a set of fields for user input and a button for submitting query", () => {
        cy.mount(
        <QueryForm 
            availableNodes={props.availableNodes}
            diagnosisOptions={props.diagnosisOptions}
            assessmentOptions={props.assessmentOptions}
            selectedNode={props.selectedNode}
            minAge={props.minAge}
            maxAge={props.maxAge}
            sex={props.sex}
            diagnosis={props.diagnosis}
            isControl={props.isControl}
            minNumSessions={props.minNumSessions}
            setIsControl={props.setIsControl}
            assessmentTool={props.assessmentTool}
            imagingModality={props.imagingModality}
            updateCategoricalQueryParams={props.updateCategoricalQueryParams}
            updateContinuousQueryParams={props.updateContinuousQueryParams}
            loading={props.loading}
            onSubmitQuery={props.onSubmitQuery}
        />);
        cy.get('[data-cy="Neurobagel graph-categorical-field"]').should("be.visible");
        cy.get('[data-cy="Minimum age-continuous-field"]').should("be.visible");
        cy.get('[data-cy="Maximum age-continuous-field"]').should("be.visible");
        cy.get('[data-cy="Neurobagel graph-categorical-field"]').should("be.visible");
        cy.get('[data-cy="Sex-categorical-field"]').should("be.visible");
        cy.get('[data-cy="Diagnosis-categorical-field"]').should("be.visible");
        cy.get('[data-cy="healthy-control-checkbox"]').should("be.visible");
        cy.get('[data-cy="Minimum number of sessions-continuous-field"]').should("be.visible");
        cy.get('[data-cy="Assessment tool-categorical-field"]').should("be.visible");
        cy.get('[data-cy="Imaging modality-categorical-field"]').should("be.visible");
        cy.get('[data-cy="submit-query-button"]').should("be.visible");
    })
})