export const environment = {
  production: true,
  vehicleUrl: '#{vehicleApiUrl}#',
  inventoryUrl: '#{inventoryApiUrl}#',
  cdnEndpoint: '#{cdnEndpoint}#',
  authorization: {
    authority: '#{authApiUrl}#',
    clientId: 'announcements-component-harness',
    clientScope: 'vehicle inventory',
    silentRedirectUri: '/callback',
  },
};
