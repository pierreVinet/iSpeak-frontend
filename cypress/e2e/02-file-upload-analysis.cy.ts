describe("File Upload and Server Analysis", () => {
  //do only once
  before(() => {
    cy.visit("/auth/signin");
    // Enter valid credentials
    cy.get("#email").type(Cypress.env("user_email"));
    cy.get("#password").type(Cypress.env("user_password"));
    cy.get('button[type="submit"]').click();
    // Should redirect to dashboard
    cy.url().should("include", "/dashboard");
  });

  beforeEach(() => {
    // Navigate to upload page
    cy.visit("/dashboard/sessions/upload");
  });

  it("should handle file upload via click and display file info", () => {
    const fileName = "low_severity_dysarthria.wav";
    const fileContent = "fake audio content";

    // Create a mock file
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: "audio/mpeg",
      },
      { force: true }
    );

    // Should show file information
    cy.contains("Session Information").should("be.visible");
    cy.contains(fileName).should("be.visible");

    // Should show form for session details
    cy.contains("Continue").should("be.visible");
  });

  it("should test server health check", () => {
    // Mock health check endpoint
    cy.request("GET", Cypress.env("api_url")).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.equal({
        status: "healthy",
        message: "iSpeak backend is running",
      });
    });
  });
});
