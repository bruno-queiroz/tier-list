const interceptAll = () => {
  cy.intercept("GET", "/tier-list/*", { fixture: "tier-list" });
  cy.intercept("PATCH", "/tier-list/*", {
    statusCode: 200,
    body: {
      isOk: true,
      msg: "Updating from cypress",
    },
  }).as("patchTierList");
  cy.intercept("PATCH", "/tier-list-items/*", {
    statusCode: 200,
    body: {
      isOk: true,
      msg: "Updating items from cypress",
    },
  });
};

describe("Test Tier list page", () => {
  it("Dragging items to the tier list row 0, 1 and 2", () => {
    cy.visit("/tier-list/123");
    interceptAll();

    cy.get("[data-testid=tier-list-title]").should("exist");
    cy.get("[data-row-index=0]").children().should("not.exist");
    cy.get("[data-testid=not-selected-items]")
      .children()
      .should("have.length", 3);

    cy.get("[data-item-not-selected-index=0]").drag("[data-row-index=0]");
    cy.get("[data-row-index=0]")
      .children("[data-tierlist-item-index=0]")
      .should("have.length", 1);
    cy.get("[data-testid=not-selected-items]")
      .children()
      .should("have.length", 2);

    cy.get("[data-item-not-selected-index=0]").drag("[data-row-index=1]");
    cy.get("[data-item-not-selected-index=0]").drag("[data-row-index=2]");

    cy.get("[data-testid=not-selected-items]")
      .children()
      .should("have.length", 0);
  });
  it("Dragging item to the tier list row 3", () => {
    cy.visit("/tier-list/123");
    interceptAll();

    cy.get("[data-testid=tier-list-title]").should("exist");
    cy.get("[data-row-index=0]").children().should("not.exist");

    cy.get("[data-testid=not-selected-items]")
      .children()
      .should("have.length", 3);

    cy.get("[data-item-not-selected-index=0]").drag("[data-row-index=3]");
    cy.get("[data-row-index=3]")
      .children("[data-tierlist-item-index=0]")
      .should("have.length", 1);

    cy.get("[data-testid=not-selected-items]")
      .children()
      .should("have.length", 2);
  });
});
