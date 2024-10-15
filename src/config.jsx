const CLIENT_ID = "0oakadewugRpwmMM25d7";
const ISSUER = "https://dev-85257838.okta.com";
const OKTA_TESTING_DISABLEHTTPSCHECK = true;
const REDIRECT_URI = `${window.location.origin}/login/callback`;

// eslint-disable-next-line
export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid','profile' ,'email','groups'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
