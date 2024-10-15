import React from 'react';
import "./App.css";
import MovieTable from './MovieTable.js';


function App() {
  return (
    <div>
      <div style={{margin: "10px"}}>
        <h1>Movies</h1>
        <MovieTable></MovieTable>
      </div>
    </div>

  )
}

export default App