describe("Test Home page", () => {
  it("Test navigating through all routes", () => {
    cy.visit("/");

    cy.intercept("GET", "/tier-list", { fixture: "tier-lists" });

    cy.get("[data-testid=tier-list-card-0]").click();

    cy.intercept("GET", "/tier-list/*", { fixture: "tier-list" });

    cy.url().should("include", "tier-list/652557ca3a85223c29e72a29");

    cy.get("[data-testid=create-tier-list]").click();

    cy.url().should("include", "create-tier-list");

    cy.get("[data-testid=home]").click();

    cy.get("[data-testid=tier-list-card-0]").should("exist");
  });
});
