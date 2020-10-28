// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  vehicleUrl: 'https://vehicle-api-test.adesaauctionoperations.com',
  inventoryUrl: 'https://inventory-api-test.adesaauctionoperations.com',
  cdnEndpoint: 'http://localhost:52387',
  authorization: {
    authority: 'https://authorization-api-test.adesaauctionoperations.com',
    clientId: 'announcements-component-harness',
    clientScope: 'vehicle inventory',
    silentRedirectUri: '/callback',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
