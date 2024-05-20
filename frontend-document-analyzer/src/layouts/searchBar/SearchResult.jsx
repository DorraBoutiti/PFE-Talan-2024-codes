import React from "react";
import PropTypes from "prop-types"; 

import "./SearchResult.css";

export const SearchResult = ({ result }) => (
  <div className="search-result" onClick={(e) => alert(`You selected ${result}!`)}>
    {result}
  </div>
);

// Prop types validation
SearchResult.propTypes = {
  result: PropTypes.string.isRequired,
};
