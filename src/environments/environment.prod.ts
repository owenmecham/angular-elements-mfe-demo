export const environment = {
  production: true,
  vehicleUrl: '#{vehicleApiUrl}#',
  inventoryUrl: '#{inventoryApiUrl}#',
  cdnEndpoint: 'http://localhost:9081',
  authorization: {
    authority: '#{authApiUrl}#',
    clientId: 'announcements-component-harness',
    clientScope: 'vehicle inventory',
    silentRedirectUri: '/callback',
  },
};
