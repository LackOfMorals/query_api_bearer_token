import React from 'react';
import "./App.css";


import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Routes from './components/Routes';
import config from './config';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
  const navigate = useNavigate();
  const restoreOriginalUri = (_oktaAuth,  originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Container text style={{marginTop: '7em'}} className="App">
        <main>
          <Routes />
        </main>
      </Container>
    </Security>
  );
};
export default App;
