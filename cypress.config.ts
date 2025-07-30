import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://ispeak.therapy-science.ch/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // Disable automatic test re-runs on file changes
    watchForFileChanges: false,
  },
});
