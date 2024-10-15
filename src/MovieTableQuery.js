import { encode } from "base-64";
import { useEffect, useState } from "react";

const useQueryAPI = ( query ) => {
  const [listMovies, setListMovies] = useState([]);
  const [readyForRender, setReadyForRender] = useState(false);

  const username = "neo4j"
  const password = "password"
  
  useEffect( () => {
    const fetchData = async() => {
      try {
        const response = await fetch( "https://neo4j.giffard.xyz/db/neo4j/query/v2" ,
            {
              method : "POST",
              headers : {
                "Content-Type" : "application/json",
                'Authorization': 'Basic ' + encode(username + ":" + password),
                },
              body: JSON.stringify({statement:"MATCH (p:Person)-[a:ACTED_IN]->(m:Movie) RETURN m.title, m.released, COLLECT(p.name) LIMIT 10"})
            }
          )
       
       
        if (response.status === 202) {
          const json = await response.json();
          
          const moviesMap = json.data["values"].map( movieEntries => { return movieEntries });
          
          setListMovies(moviesMap);
          
          setReadyForRender(true);
          }  

      } catch(error) {
        // enter your logic for when there is an error (ex. error toast)
        console.log(error)
        }
        
    };

    fetchData()
     .catch(console.error);;
  
  }, []);

  return { readyForRender, listMovies};
  
};
  
export default useQueryAPI