import { useEffect, useState } from "react";

const useQueryAPI = ( idToken ) => {
  const [listMovies, setListMovies] = useState([]);
  
  useEffect( () => {
    const fetchData = async() => {
      try {
        const response = await fetch( "https://neo4j.giffard.xyz/db/neo4j/query/v2" ,
            {
              method : "POST",
              headers : {
                "Content-Type" : "application/json",
                'Authorization': 'Bearer ' + idToken,
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

  return {listMovies};
  
};
  
export default useQueryAPI