import React from 'react';
import "./App.css";
import useQueryAPI from './MovieTableQuery';


function MovieTable() {
  const MOVIES_QUERY = "";

  const {readyForRender, listMovies} = useQueryAPI(MOVIES_QUERY); 
  
  if(readyForRender) {
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

  } else { return <div>Loading.....</div>};

}

export default MovieTable