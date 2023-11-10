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

  it("Edit tier name through row modal", () => {
    cy.visit("/tier-list/123");
    interceptAll();

    cy.get("[data-testid=open-row-modal-0]").click();

    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=tier-name-0]").contains("S");
    cy.get("[data-testid=tier-name-1").contains("A");
    cy.get("[data-testid=tier-name-2]").contains("B");
    cy.get("[data-testid=tier-name-3]").contains("C");
    cy.get("[data-testid=tier-name-4]").contains("D");

    cy.get("[data-testid=row-modal-textarea]").type("testing");
    cy.get("[data-testid=row-modal-textarea]").should("have.value", "Stesting");

    cy.get("[data-testid=tier-name-0]").contains("Stesting");
    cy.get("[data-testid=tier-name-1").contains("A");
    cy.get("[data-testid=tier-name-2]").contains("B");
    cy.get("[data-testid=tier-name-3]").contains("C");
    cy.get("[data-testid=tier-name-4]").contains("D");

    cy.get("[data-testid=close-row-modal-btn]").click();
    cy.get("[data-testid=row-modal]").should("not.exist");

    cy.get("[data-testid=open-row-modal-1]").click();
    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=row-modal-textarea]").type("change");
    cy.get("[data-testid=row-modal-textarea]").should("have.value", "Achange");

    cy.get("[data-testid=tier-name-0]").contains("Stesting");
    cy.get("[data-testid=tier-name-1").contains("Achange");
    cy.get("[data-testid=tier-name-2]").contains("B");
    cy.get("[data-testid=tier-name-3]").contains("C");
    cy.get("[data-testid=tier-name-4]").contains("D");
  });
  it("Delete tier row", () => {
    cy.visit("/tier-list/123");
    interceptAll();

    cy.get("[data-testid=open-row-modal-0]").click();
    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=tierlist-container]")
      .children()
      .should("have.length", 5);

    cy.get("[data-testid=delete-row-btn]").click();

    cy.get("[data-testid=tierlist-container]")
      .children()
      .should("have.length", 4);

    cy.get("[data-testid=open-row-modal-0]").click();
    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=delete-row-btn]").click();

    cy.get("[data-testid=tierlist-container]")
      .children()
      .should("have.length", 3);

    cy.get("[data-testid=open-row-modal-0]").click();
    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=delete-row-btn]").click();

    cy.get("[data-testid=tierlist-container]")
      .children()
      .should("have.length", 2);

    cy.get("[data-testid=open-row-modal-0]").click();
    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=delete-row-btn]").click();

    cy.get("[data-testid=tierlist-container]")
      .children()
      .should("have.length", 1);

    cy.get("[data-testid=open-row-modal-0]").click();
    cy.get("[data-testid=row-modal]").should("be.visible");

    cy.get("[data-testid=delete-row-btn]").click();

    cy.get("[data-testid=tierlist-container]")
      .children()
      .should("have.length", 0);
  });
});
