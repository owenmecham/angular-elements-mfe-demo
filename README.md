# Components

This project exports two angular elements for use in other adesa applications:

- mrclean-magic

  - Component that allows a user to add announcements to a auction-site/inventory.
  - Inputs
    - auction-site-id - The id of the auction site
    - inventory-id - The id of the inventory to add announcements to
    - has-edit-permission - Determines if the edit button is enabled for mrclean-magic-view component
    - site-theme-name - Determines primary color for the component. Options are 'amp' or 'portal'
    - adesa-locale - The locale to use for localization
    - external-context-token - TBD

- mrclean-magic-view
  - Component that allows a user to view announcements for a auction-site/inventory
  - Inputs
    - auction-site-id - The id of the auction site
    - inventory-id - The id of the inventory to add announcements to
    - has-edit-permission - Determines if the edit button is enabled for mrclean-magic-view component
    - adesa-locale - The locale to use for localization
    - external-context-token - TBD

## Material Design Icons

- This project uses Material Design Icons. Please include the following CDN link in your project:
  - `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

## Content CDN Urls

- Dev
  - `https://www-announcements-dev.adesaauctionoperations.com/elements/mrclean-magic.js`
- Test
  - `https://www-announcements-test.adesaauctionoperations.com/elements/mrclean-magic.js`
- UAT

  - `https://www-announcements-uat.adesaauctionoperations.com/elements/mrclean-magic.js`

- Including in your project sample:
  - `<script defer type="module" src="https://www-announcements-dev.adesaauctionoperations.com/elements/mrclean-magic.js"></script>`
  - If including in an angular app, make sure you include the CUSTOM_ELEMENTS_SCHEMA in the module you are consuming the component.
    `import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; @NgModule({ ... schemas: [CUSTOM_ELEMENTS_SCHEMA] ... })`

## Initializing Git submodule

This project uses a Git submodule (mrclean-magic-i18n-resources) for PO Editor integration. To initialize the submodule, navigate to the submodule directory (currently src/assets/i18n) and run the following commands:
git submodule init
git submodule update --remote
git checkout localization
git pull

## Setup auth with Adesa npm registry

To setup auth with the private npm registry, run: `npx better-vsts-npm-auth -config .npmrc`

This command will take you to a website that provides another command to run. The command will look like this: `better-vsts-npm-auth config set refresh_token <insert token here>`. Run that command with `npx` in front of it and the token that the site provides.

Now run the original command again to confirm that the token was setup correctly: `npx better-vsts-npm-auth -config .npmrc`

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:52387/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/elements` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

The e2e tests load their configuration using either environment variables or command line arguments. The e2e tests are setup to use [dotenv](https://www.npmjs.com/package/dotenv) and check the e2e folder for a .env file. If a setting doesn't exist as a command line argument, then it will check for an environment variable. If neither exist, the tests will fail with an error message saying which setting is missing.

Run `npm run e2e` to execute the end-to-end tests via [testcafe](https://devexpress.github.io/testcafe/).
