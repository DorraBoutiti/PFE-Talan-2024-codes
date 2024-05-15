import React, { useState } from "react";
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import PropTypes from "prop-types"; // Import PropTypes for type validation

import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return value && user && user.name && user.name.toLowerCase().includes(value);
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
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
