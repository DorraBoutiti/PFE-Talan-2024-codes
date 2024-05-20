import React from "react";
import PropTypes from "prop-types"; 

import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results }) => {
  console.log(results);
  return (
    <div className="results-list" style={{ zIndex: 9999, position: 'absolute', top: '100%', left: 0, width: '100%' }}>
      
      {results.map((result) => (
        <SearchResult result={result.full_name} key={result.id_candidat} />
      ))}

    </div>
  );
};



SearchResultsList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,    
    })
  ).isRequired,
};
