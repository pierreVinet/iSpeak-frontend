# Cypress E2E Tests for iSpeak Frontend

This directory contains end-to-end tests for the iSpeak frontend application using Cypress.

## Test Structure

### 1. Authentication Tests (`01-auth-login.cy.ts`)

- Login form validation
- Successful login flow
- Redirection to dashboard
- Error handling for invalid credentials
- Loading states

### 2. File Upload & Analysis Tests (`02-file-upload-analysis.cy.ts`)

- File upload interface
- Drag & drop functionality
- File type validation
- Server health check
- Analysis start process
- Status monitoring

## Setup

1. **Install Dependencies**

   ```bash
   yarn install
   ```

2. **Configure Environment**
   - Copy `cypress.env.json.example` to `cypress.env.json`
   - Update the API URL and test credentials
3. **Start the Application**

   ```bash
   yarn dev
   ```

4. **Run Tests**

   ```bash
   # Open Cypress Test Runner
   yarn cypress:open

   # Run tests headlessly
   yarn cypress:run

   # Run specific test file
   yarn cypress:run --spec "cypress/e2e/01-auth-login.cy.ts"
   ```

## Test Data

## API Mocking

Tests use Cypress intercepts to mock API responses:

- Authentication endpoints (`/api/auth/signin/credentials`, `/api/auth/session`)
- Health check endpoint (`/`)

## Custom Commands

Located in `cypress/support/commands.ts`:

- `cy.login(email, password)` - Login helper
- `cy.checkAuthenticated()` - Verify authentication
- `cy.uploadFile(fileName, mimeType)` - File upload helper
- `cy.waitForFileProcessing()` - Wait for file processing

## Test Attributes

Components include `data-testid` attributes for reliable element selection:

- `data-testid="file-upload-area"` - File upload drop zone
- `data-testid="patient-select"` - Patient selection dropdown

## Notes

- Tests run against mocked backends to ensure consistent, fast execution
- File uploads use mock file data to avoid real file dependencies
- All sensitive data is mocked for security
- Tests are designed to be independent and can run in any order
