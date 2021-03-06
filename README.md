# Components

This project exports two angular elements for use in other mrclean applications:

- mrclean-magic

  - Component that allows a user to add announcements to a auction-site/inventory.
  - Inputs
    - auction-site-id - The id of the auction site
    - inventory-id - The id of the inventory to add announcements to
    - has-edit-permission - Determines if the edit button is enabled for mrclean-magic-view component
    - site-theme-name - Determines primary color for the component. Options are 'amp' or 'portal'
    - mrclean-locale - The locale to use for localization
    - external-context-token - TBD

- mrclean-magic-view
  - Component that allows a user to view announcements for a auction-site/inventory
  - Inputs
    - auction-site-id - The id of the auction site
    - inventory-id - The id of the inventory to add announcements to
    - has-edit-permission - Determines if the edit button is enabled for mrclean-magic-view component
    - mrclean-locale - The locale to use for localization
    - external-context-token - TBD

## Material Design Icons

- This project uses Material Design Icons. Please include the following CDN link in your project:

  - `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

- Including in your project sample:
  - `<script defer type="module" src="{domain}/elements/mrclean-magic.js"></script>`
  - If including in an angular app, make sure you include the CUSTOM_ELEMENTS_SCHEMA in the module you are consuming the component.
    `import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; @NgModule({ ... schemas: [CUSTOM_ELEMENTS_SCHEMA] ... })`

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:52387/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/elements` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

The e2e tests load their configuration using either environment variables or command line arguments. The e2e tests are setup to use [dotenv](https://www.npmjs.com/package/dotenv) and check the e2e folder for a .env file. If a setting doesn't exist as a command line argument, then it will check for an environment variable. If neither exist, the tests will fail with an error message saying which setting is missing.

Run `npm run e2e` to execute the end-to-end tests via [testcafe](https://devexpress.github.io/testcafe/).
