describe("Test CreateTierList page", () => {
  it("Properly filled form should be submitted", () => {
    cy.visit("/create-tier-list");

    cy.get("[data-testid=create-tier-list-title").should("exist");

    cy.get("[data-testid=tier-list-name-input]").type("testing on cypress");

    cy.intercept("POST", "/tier-list", {
      statusCode: 201,
      body: {
        isOk: true,
        msg: "Adding from cypress",
      },
    }).as("postTierList");

    cy.intercept("POST", "/1/upload*", {
      statusCode: 201,
      body: {
        data: { url: "image link" },
      },
    }).as("imgbb");

    cy.get("[data-testid=tier-list-cover-img]").selectFile(
      "cypress/fixtures/programming-languages.png",
      { force: true }
    );

    cy.get("[data-testid=notification]").should("be.not.visible");

    cy.get("[data-testid=tier-list-images]").selectFile(
      [
        "cypress/fixtures/java.png",
        "cypress/fixtures/javascript.png",
        "cypress/fixtures/php.png",
      ],
      { force: true }
    );

    cy.get("[data-testid=submit-tier-list-btn]").click();

    cy.get("[data-testid=notification]").should("be.visible");
    cy.get("[data-testid=notification]").should(
      "contain.text",
      "Adding from cypress"
    );

    cy.wait("@postTierList").then((inter) => {
      cy.fixture("post-tier-list-right-body.json").then((rightBody) => {
        cy.wrap(inter.request.body).should("deep.equal", rightBody);
      });
    });
  });

  it("Empty form should not be submitted", async () => {
    cy.visit("/create-tier-list");

    cy.get("[data-testid=create-tier-list-title").should("exist");

    cy.get("[data-testid=submit-tier-list-btn]").click();

    const spy = cy.spy(window, "fetch").as("fetchSpy");

    expect(spy).to.not.be.called;
  });

  it("Form without tier list cover image and tier list items should not be submitted", async () => {
    cy.visit("/create-tier-list");

    cy.get("[data-testid=create-tier-list-title").should("exist");

    cy.get("[data-testid=tier-list-name-input]").type("testing on cypress");

    cy.get("[data-testid=submit-tier-list-btn]").click();

    const spy = cy.spy(window, "fetch").as("fetchSpy");

    expect(spy).to.not.be.called;
  });

  it("Form without set of images should not be submitted", async () => {
    cy.visit("/create-tier-list");

    cy.get("[data-testid=create-tier-list-title").should("exist");

    cy.get("[data-testid=tier-list-name-input]").type("testing on cypress");

    cy.get("[data-testid=tier-list-cover-img]").selectFile(
      "cypress/fixtures/programming-languages.png",
      { force: true }
    );
    cy.get("[data-testid=submit-tier-list-btn]").click();

    cy.get("[data-testid=notification]").should("be.not.visible");
  });
});
