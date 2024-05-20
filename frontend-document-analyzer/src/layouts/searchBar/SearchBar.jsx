import PropTypes from "prop-types";
import React, { useState } from "react";

import IconButton from '@mui/material/IconButton';

import "./SearchBar.css";
import Iconify from '../../components/iconify';

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
 
  //  const fetchData = () => {
  //    fetch('https://jsonplaceholder.typicode.com/users')
  //      .then((response) => response.json())
  //      .then((json) => {
  //        const results = json.filter((user) =>
  //          value && user && user.name && user.name.toLowerCase().includes(value)
  //        );
  //        setResults(results);
  //      });
  //  };

  const handleChange = (value) => {
    setInput(value);
    // fetchData(value);
  };

  const handleOpen = () => {
    fetchData(input);
  };

  return (
    <div className="input-wrapper">
      <IconButton onClick={handleOpen}>
        <Iconify icon="eva:search-fill" />
      </IconButton>
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

// Prop types validation
SearchBar.propTypes = {
  setResults: PropTypes.func.isRequired,
};
