import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./SearchResult.css";
import defaultAvatar from "../../../public/assets/images/avatars/reshot-icon-candidate.svg";

export const SearchResult = ({ result, candidateId , photo}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateToDocuments();
    }
  };

  const navigateToDocuments = () => {
    alert(`You selected ${result}!`);
    sessionStorage.setItem("candidatName", result);
    sessionStorage.setItem("email", "demo@minimals.cc");
    sessionStorage.setItem("candidateId", candidateId);
    window.location.href = `/${candidateId}/documents`;
  };

  return (
    <Link
      to={`/${candidateId}/documents`}
      className="search-result"
      onClick={navigateToDocuments}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      aria-label={`View documents for ${result}`}
      style={{ textDecoration: 'none' }}
    >
      <img src={photo || defaultAvatar} alt="avatar" className="search-result__avatar" />
      <span>{result}</span>
    </Link>
  );
};

SearchResult.propTypes = {
  result: PropTypes.string.isRequired,
  candidateId: PropTypes.number.isRequired,
  photo: PropTypes.string,
};
