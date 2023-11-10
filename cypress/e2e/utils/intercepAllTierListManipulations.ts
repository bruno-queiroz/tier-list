export const interceptAllTierListManipulations = () => {
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
