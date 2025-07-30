describe("Authentication - Login Flow", () => {
  beforeEach(() => {
    // Clear any existing sessions
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("should display the login page correctly", () => {
    cy.visit("/auth/signin");

    // Check page elements
    cy.contains("Log In").should("be.visible");
    cy.contains("Enter your email below to login to your account").should(
      "be.visible"
    );
    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.get('button[type="submit"]').should("contain", "Login");
  });

  it("should show validation errors for empty fields", () => {
    cy.visit("/auth/signin");

    // Try to submit without filling fields
    cy.get('button[type="submit"]').click();

    // Check that fields are required (HTML5 validation)
    cy.get("#email").should("have.attr", "required");
    cy.get("#password").should("have.attr", "required");
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/auth/signin");

    // Enter invalid credentials
    cy.get("#email").type("invalid@example.com");
    cy.get("#password").type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.contains("Invalid credentials").should("be.visible");

    // Should remain on login page
    cy.url().should("include", "/auth/signin");
  });

  it("should successfully login with valid credentials and redirect to dashboard", () => {
    cy.visit("/auth/signin");

    // Enter valid credentials
    cy.get("#email").type(Cypress.env("user_email"));
    cy.get("#password").type(Cypress.env("user_password"));
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard
    cy.url().should("include", "/dashboard");

    // Verify user is logged in by checking dashboard content
    cy.contains("Welcome", { timeout: 10000 }).should("be.visible");
  });
});
