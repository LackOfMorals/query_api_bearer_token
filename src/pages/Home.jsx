/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Button, Container, Grid, GridRow, Header } from 'semantic-ui-react';

import Movies from '../components/Movies';





const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const login = async () => {
    await oktaAuth.signInWithRedirect();
  };

  if (!authState) {
    return (
      <div>Loading...</div>
    );
  }  

  return (
    <div>
       <div>
        {authState.isAuthenticated && (
          <Movies userToken={authState.idToken["idToken"]} ></Movies>
        )}
        {!authState.isAuthenticated && (
          <Grid columns={1}>
            <Header textAlign='left' as='h1'> Using Bearer id token with Neo4j Query API</Header>
            <GridRow>
              <Container textAlign='left'>
              <p>
                This application shows how a bearer token can be used with Neo4js Query API. 
                
                When you click the login button below, you will be redirected to the login page on your Okta org.  The same token from Okta is 
                used to authenticate with Neo4j to display a table that shows information about movies.
              </p>
              </Container>
            </GridRow>
            <GridRow>
              <Button onClick={login}>Login</Button>
            </GridRow>
          </Grid>
        )}

      </div>
    </div>
  );
};
export default Home;
