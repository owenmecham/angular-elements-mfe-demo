export const environment = {
  production: true,
  authorization: {
    authority: '#{authApiUrl}#',
    clientId: 'announcements-component-harness',
    clientScope: 'vehicle inventory',
    silentRedirectUri: '/callback',
  },
};
