/*
 * Copyright (c) 2024-Present, Neo4j. and/or its affiliates. All rights reserved.
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
            <Header textAlign='left' as='h1'>One set of credentials</Header>
            <GridRow>
              <Container textAlign='left'>
              <p>
                This web application shows how a single set of credentials can be used to control access to the web application itself and obtain information from Neo4j to populate table. 
                
                Click on the Login button to continue
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
