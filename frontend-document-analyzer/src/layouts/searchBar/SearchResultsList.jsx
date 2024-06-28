import React from "react";
import PropTypes from "prop-types";

import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results }) => (
  <div className="results-list" style={{ zIndex: 9999, position: 'absolute', top: '100%', left: 0, width: '100%' }}>
    {results.length === 0 ? (
      <div>No candidate found</div>
    ) : (
      results.map((result) => (
        <SearchResult
          key={result.id_candidat}
          result={result.full_name}
          candidateId={result.id_candidat}
          photo={result.photoURL}  // Pass photoURL dynamically
        />
      ))
    )}
  </div>
);

SearchResultsList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      full_name: PropTypes.string.isRequired,
      id_candidat: PropTypes.number.isRequired,
      photoURL: PropTypes.string,  // Ensure the photoURL is part of the result object
    })
  ).isRequired,
};
