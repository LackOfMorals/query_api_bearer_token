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
import React, { useEffect, useState } from 'react';
import { Button, Grid, GridRow, Header } from 'semantic-ui-react';
import "../App.css";


const Movies = (userIDToken) =>  { 
  const [listMovies, setListMovies] = useState([]);
  const { oktaAuth } = useOktaAuth();

  const logout = async () => oktaAuth.signOut();

  
  useEffect( () => {
    const fetchData = async() => {
      try {
        const response = await fetch( "http://localhost:7474/db/neo4j/query/v2" ,
            {
              method : "POST",
              headers : {
                "Content-Type" : "application/json",
                'Authorization': 'Bearer ' + userIDToken["userToken"],
                },
              body: JSON.stringify({statement:"MATCH (p:Person)-[a:ACTED_IN]->(m:Movie) RETURN m.title, m.released, COLLECT(p.name) LIMIT 10"})
            }
          )
       
       
        if (response.status === 202) {
          const json = await response.json();
          
          const moviesMap = json.data["values"].map( movieEntries => { return movieEntries });
          
          setListMovies(moviesMap);
          
          }  

      } catch(error) {
        // enter your logic for when there is an error (ex. error toast)
        console.log(error)
        }
        
    };

    fetchData()
     .catch(console.error);;
  
  }, []);


  return (
    <Grid columns={1}>
            <GridRow>
              <Header textAlign='left' as='h1'>Movies</Header>
            </GridRow>
            <GridRow>
                <div className='movies-table-wrapper'>
                  <table className='movies-table'>
                    <tbody>
                    <tr className='movie-header-row'>
                            <th className='movie-header'>title</th>
                            <th className='movie-header'>released</th>
                            <th className='movie-header'>starring</th>
                    </tr>
                    {listMovies.map((val, key) => {
                            return (
                                <tr key={key} className='movie-row'>
                                    <td className='movie-row-cell'>{val[0]}</td>
                                    <td className='movie-row-cell'>{val[1]}</td>
                                    <td className='movie-row-cell'>{val[2]+""}</td>
                                </tr>
                                )
                              }
                            )
                          }
                      </tbody>
                    </table>
                </div>
            </GridRow>
            <GridRow>
            <Button onClick={logout}>Logout</Button>
            </GridRow>
          </Grid>
  );
}

export default Movies;