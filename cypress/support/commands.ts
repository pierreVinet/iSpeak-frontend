/// <reference types="cypress" />

// ***********************************************
// Custom commands for the iSpeak application
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via UI
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to check if user is authenticated
       * @example cy.checkAuthenticated()
       */
      checkAuthenticated(): Chainable<void>;

      /**
       * Custom command to upload a file via drag and drop
       * @example cy.uploadFile('test-audio.mp3', 'audio/mpeg')
       */
      uploadFile(fileName: string, mimeType: string): Chainable<void>;

      /**
       * Custom command to wait for file processing
       * @example cy.waitForFileProcessing()
       */
      waitForFileProcessing(): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/signin");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get('button[type="submit"]').click();
});

// Check authentication status
Cypress.Commands.add("checkAuthenticated", () => {
  cy.url().should("include", "/dashboard");
  cy.contains("Dashboard", { timeout: 10000 }).should("be.visible");
});

// File upload command
Cypress.Commands.add("uploadFile", (fileName: string, mimeType: string) => {
  cy.fixture(fileName, "base64").then((fileContent) => {
    const blob = Cypress.Blob.base64StringToBlob(fileContent, mimeType);
    const file = new File([blob], fileName, { type: mimeType });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    cy.get('[data-testid="file-upload-area"]').trigger("drop", {
      dataTransfer,
    });
  });
});

// Wait for file processing
Cypress.Commands.add("waitForFileProcessing", () => {
  cy.contains("Processing...").should("be.visible");
  cy.contains("Ready", { timeout: 15000 }).should("be.visible");
});

export {};
