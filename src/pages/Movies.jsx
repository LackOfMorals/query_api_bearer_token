import React, { useEffect, useState } from 'react';
import "../App.css";
import useQueryAPI from '../components/MovieTableQuery';

import { useOktaAuth } from '@okta/okta-react';




const Movies = () =>  { 
  const { authState, oktaAuth } = useOktaAuth();
  const [userToken, setUserToken] = useState(null);

   useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any ID Token
      setUserToken(null);
    } else {
      setUserToken(authState.idToken["idToken"]);
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const {listMovies} = useQueryAPI(userToken); 
  
  return (
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
  );
}

export default Movies;