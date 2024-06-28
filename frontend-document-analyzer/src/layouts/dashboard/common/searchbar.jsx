import React, { useState } from 'react';

import Slide from '@mui/material/Slide';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import Iconify from '../../../components/iconify';
import * as api from '../../../services/service1';
import { SearchResultsList } from '../../searchBar/SearchResultsList';

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column', 
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');

  const handleInputChange = async (newValue) => {
    try {
      
      setValue(newValue); 
      const response = await api.search(newValue);      
      setOptions(response);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleSelectOption = (event, option) => {
  //   if (option) {
  //     console.log(option.id_candidat);
  //   }
  //   handleClose();
  // };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              disableUnderline
              placeholder="Search placeholder..."
              value={value}
              onChange={(event) => handleInputChange(event.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />

            <Button variant="contained" onClick={handleClose}>
              Search
            </Button>

            {options.length > 0 && <SearchResultsList results={options} />} {/* Render SearchResultsList component */}
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
